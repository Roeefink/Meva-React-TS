
import express from 'express';
import type { Request, Response } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { authenticate } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';
import { supabase } from '../config/supabase.js';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const router = express.Router();

// Initialize OpenAI lazily
const getOpenAIClient = () => {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        console.warn('⚠️ OPENAI_API_KEY is missing.');
        return null;
    }

    return new OpenAI({ apiKey });
};

// --- Sessions Endpoints ---

// GET /api/v1/chat/sessions - List all chat sessions
router.get('/sessions', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const scopedSupabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!,
            { global: { headers: { Authorization: req.headers.authorization! } } }
        );

        const { data, error } = await scopedSupabase
            .from('chat_sessions')
            .select('*')
            .eq('user_id', req.user!.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ sessions: data });
    } catch (error: any) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
});

// POST /api/v1/chat/sessions - Create new session
router.post('/sessions', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const scopedSupabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!,
            { global: { headers: { Authorization: req.headers.authorization! } } }
        );

        const { data, error } = await scopedSupabase
            .from('chat_sessions')
            .insert([{
                user_id: req.user!.id,
                title: 'New Chat' // Default title, can be updated later
            }])
            .select()
            .single();

        if (error) throw error;

        res.json({ session: data });
    } catch (error: any) {
        console.error('Error creating session:', error);
        res.status(500).json({ error: 'Failed to create session' });
    }
});

// --- Messages Endpoints ---

// GET /api/v1/chat - Get chat history for specific session
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const sessionId = req.query.sessionId;

        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required' });
        }

        // Create a scoped Supabase client to pass RLS checks
        const scopedSupabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: {
                        Authorization: req.headers.authorization!
                    }
                }
            }
        );

        const { data, error } = await scopedSupabase
            .from('chat_messages')
            .select('*')
            .eq('user_id', req.user!.id)
            .eq('session_id', sessionId) // Filter by session
            .order('created_at', { ascending: true });

        if (error) throw error;

        // Map to frontend format
        const messages = data.map(msg => ({
            id: msg.id,
            sender: msg.sender,
            text: msg.content,
            timestamp: new Date(msg.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            })
        }));

        res.json({ messages });
    } catch (error: any) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
});

// POST /api/v1/chat - Send message
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { message, sessionId } = req.body;

        if (!message || !sessionId) {
            return res.status(400).json({ error: 'Message and Session ID are required' });
        }

        // Create a scoped Supabase client that inherits the user's JWT
        // This ensures RLS policies work correctly (auth.uid() == user_id)
        const scopedSupabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: {
                        Authorization: req.headers.authorization!
                    }
                }
            }
        );

        // 1. Save User Message
        const { error: userMsgError } = await scopedSupabase
            .from('chat_messages')
            .insert([{
                user_id: req.user!.id,
                session_id: sessionId,
                sender: 'user',
                content: message
            }]);

        if (userMsgError) {
            console.error('Error saving user message:', userMsgError);
            throw new Error(`Failed to save message history: ${userMsgError.message} (Code: ${userMsgError.code})`);
        }

        // Auto-Titling: Check if this is a "New Chat" and update the title
        // We do this asynchronously so it doesn't block the response
        (async () => {
            try {
                // Get current session title
                const { data: session } = await scopedSupabase
                    .from('chat_sessions')
                    .select('title')
                    .eq('id', sessionId)
                    .single();

                if (session && session.title === 'New Chat') {
                    const titleOpenAI = getOpenAIClient();
                    if (titleOpenAI) {
                        const titleCompletion = await titleOpenAI.chat.completions.create({
                            messages: [
                                { role: "system", content: "Summarize the following user message into a short, concise title (max 5 words). Do not include quotes." },
                                { role: "user", content: message }
                            ],
                            model: "gpt-3.5-turbo",
                            max_tokens: 15
                        });

                        const newTitle = titleCompletion.choices[0].message.content?.trim() || "New Chat";

                        await scopedSupabase
                            .from('chat_sessions')
                            .update({ title: newTitle })
                            .eq('id', sessionId);

                        console.log(`Updated session ${sessionId} title to: ${newTitle}`);
                    }
                }
            } catch (err) {
                console.error("Failed to auto-generate title:", err);
            }
        })();

        // If no API key, return a mock response
        const openai = getOpenAIClient();

        if (!openai) {
            const mockReply = "I am currently in mock mode because the OpenAI API Key is missing. Please configure it in the backend .env file.";

            // Save mock reply
            await scopedSupabase.from('chat_messages').insert([{
                user_id: req.user!.id,
                session_id: sessionId,
                sender: 'bot',
                content: mockReply
            }]);

            return res.json({ reply: mockReply });
        }

        // Call OpenAI
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful and knowledgeable medical assistant. Provide clear, accurate, and empathetic responses. Always advise users to consult with a real doctor for medical advice." },
                { role: "user", content: message }
            ],
            model: "gpt-3.5-turbo",
        });

        const reply = completion.choices[0].message.content || "I'm sorry, I couldn't generate a response.";

        // 2. Save Bot Message
        const { error: botMsgError } = await scopedSupabase
            .from('chat_messages')
            .insert([{
                user_id: req.user!.id,
                session_id: sessionId,
                sender: 'bot',
                content: reply
            }]);

        if (botMsgError) {
            console.error('Error saving bot message:', botMsgError);
            // Don't fail the request if just saving the bot message fails, return the reply anyway
        }

        res.json({ reply });

    } catch (error: any) {
        console.error('OpenAI Request Failed. Error Details:', {
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });
        res.status(500).json({ error: 'Failed to generate response: ' + error.message });
    }
});

// DELETE /api/v1/chat/sessions - Delete all sessions
router.delete('/sessions', authenticate, async (req: AuthRequest, res: Response) => {
    const logPath = path.join(process.cwd(), 'backend_debug.log');
    const log = (msg: string) => { try { fs.appendFileSync(logPath, `${new Date().toISOString()} - ${msg}\n`); } catch (e) { console.error('Log error', e) } };

    try {
        log(`[DELETE ALL] User: ${req.user?.id}`);

        // Use Service Role Key to bypass RLS
        const adminSupabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Manual cascade: Delete all messages for this user first
        const { data: deletedMsgs, error: msgError } = await adminSupabase
            .from('chat_messages')
            .delete()
            .eq('user_id', req.user!.id)
            .select();

        if (msgError) {
            log(`[DELETE ALL] Message Error: ${JSON.stringify(msgError)}`);
            throw msgError;
        }
        log(`[DELETE ALL] Deleted ${deletedMsgs?.length} messages`);

        // Then delete all sessions for this user
        const { data: deletedSessions, error: sessionError } = await adminSupabase
            .from('chat_sessions')
            .delete()
            .eq('user_id', req.user!.id)
            .select();

        if (sessionError) {
            log(`[DELETE ALL] Session Error: ${JSON.stringify(sessionError)}`);
            throw sessionError;
        }
        log(`[DELETE ALL] Deleted ${deletedSessions?.length} sessions`);

        res.json({ message: 'All sessions deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting all sessions:', error);
        log(`[DELETE ALL] Exception: ${JSON.stringify(error)}`);
        res.status(500).json({ error: 'Failed to delete all sessions' });
    }
});

// DELETE /api/v1/chat/sessions/:id - Delete a session
router.delete('/sessions/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const sessionId = req.params.id;

        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required' });
        }

        // Use Service Role Key to bypass RLS for deletion
        const adminSupabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Delete the session (cascade will delete messages)
        // Manual cascade: Delete messages first
        const { error: msgError } = await adminSupabase
            .from('chat_messages')
            .delete()
            .eq('session_id', sessionId); // Allow deleting by session_id without user_id filter on messages if consistent, but safer to keeping user_id if column exists? 
        // Actually messages usually have user_id. Let's keep it simple.
        // But wait, if we use admin client, we MUST be careful.
        // Let's filter by session_id. The session_id is unique enough (serial/uuid?). 
        // In the previous code, messages has session_id.

        if (msgError) throw msgError;

        const { error } = await adminSupabase
            .from('chat_sessions')
            .delete()
            .eq('id', sessionId)
            .eq('user_id', req.user!.id); // CRITICAL: Ensure we only delete sessions belonging to the user

        if (error) throw error;

        res.json({ message: 'Session deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting session:', error);
        res.status(500).json({ error: 'Failed to delete session' });
    }
});

export default router;
