
import express from 'express';
import type { Request, Response } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
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

// GET /api/v1/chat - Get chat history
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
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
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
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
                sender: 'user',
                content: message
            }]);

        if (userMsgError) {
            console.error('Error saving user message:', userMsgError);
            throw new Error(`Failed to save message history: ${userMsgError.message} (Code: ${userMsgError.code})`);
        }

        // If no API key, return a mock response
        const openai = getOpenAIClient();

        if (!openai) {
            const mockReply = "I am currently in mock mode because the OpenAI API Key is missing. Please configure it in the backend .env file.";

            // Save mock reply
            await scopedSupabase.from('chat_messages').insert([{
                user_id: req.user!.id,
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

export default router;
