import express from 'express';
import type { Request, Response } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { authenticate } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../config/db.js';

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
        const sessions = await prisma.chatSession.findMany({
            where: { user_id: req.user!.id },
            orderBy: { created_at: 'desc' }
        });

        // Map _id to id for frontend compatibility
        const formattedSessions = sessions.map(session => ({
            id: session.id,
            user_id: session.user_id,
            title: session.title,
            created_at: session.created_at
        }));

        res.json({ sessions: formattedSessions });
    } catch (error: any) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
});

// POST /api/v1/chat/sessions - Create new session
router.post('/sessions', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const newSession = await prisma.chatSession.create({
            data: {
                user_id: req.user!.id,
                title: 'New Chat'
            }
        });

        res.json({
            session: {
                id: newSession.id,
                user_id: newSession.user_id,
                title: newSession.title,
                created_at: newSession.created_at
            }
        });
    } catch (error: any) {
        console.error('Error creating session:', error);
        res.status(500).json({ error: 'Failed to create session' });
    }
});

// --- Messages Endpoints ---

// GET /api/v1/chat - Get chat history for specific session
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const sessionId = req.query.sessionId as string;

        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required' });
        }

        const messages = await prisma.chatMessage.findMany({
            where: {
                user_id: req.user!.id,
                session_id: sessionId
            },
            orderBy: { created_at: 'asc' }
        });

        // Map to frontend format
        const formattedMessages = messages.map(msg => ({
            id: msg.id,
            sender: msg.sender,
            text: msg.content,
            timestamp: new Date(msg.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            })
        }));

        res.json({ messages: formattedMessages });
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

        // Fetch previous chat history for context from database
        const previousMessages = await prisma.chatMessage.findMany({
            where: { session_id: sessionId },
            orderBy: { created_at: 'desc' },
            take: 10
        });

        // 1. Save User Message
        const userMsg = await prisma.chatMessage.create({
            data: {
                user_id: req.user!.id,
                session_id: sessionId,
                sender: 'user',
                content: message
            }
        });

        // Auto-Titling
        (async () => {
            try {
                const session = await prisma.chatSession.findUnique({ where: { id: sessionId } });
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

                        await prisma.chatSession.update({
                            where: { id: sessionId },
                            data: { title: newTitle }
                        });
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

            await prisma.chatMessage.create({
                data: {
                    user_id: req.user!.id,
                    session_id: sessionId,
                    sender: 'bot',
                    content: mockReply
                }
            });

            return res.json({ reply: mockReply });
        }

        // Prepare context for OpenAI
        const historyContext = (previousMessages || []).reverse().map(msg => ({
            role: msg.sender === 'user' ? ('user' as const) : ('assistant' as const),
            content: msg.content
        }));

        // Call OpenAI
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful and knowledgeable medical assistant. Provide clear, accurate, and empathetic responses. Always advise users to consult with a real doctor for medical advice." },
                ...historyContext,
                { role: "user", content: `(User's current message): ${message}` }
            ],
            model: "gpt-3.5-turbo",
        });

        const reply = completion.choices[0].message.content || "I'm sorry, I couldn't generate a response.";

        // 2. Save Bot Message
        await prisma.chatMessage.create({
            data: {
                user_id: req.user!.id,
                session_id: sessionId,
                sender: 'bot',
                content: reply
            }
        });

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
    try {
        await prisma.chatMessage.deleteMany({ where: { user_id: req.user!.id } });
        await prisma.chatSession.deleteMany({ where: { user_id: req.user!.id } });

        res.json({ message: 'All sessions deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting all sessions:', error);
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

        // Delete messages associated with the session first
        await prisma.chatMessage.deleteMany({ where: { session_id: sessionId } });

        // Delete the session itself, ensuring it belongs to the user
        const result = await prisma.chatSession.deleteMany({
            where: {
                id: sessionId,
                user_id: req.user!.id
            }
        });

        if (result.count === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }

        res.json({ message: 'Session deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting session:', error);
        res.status(500).json({ error: 'Failed to delete session' });
    }
});

export default router;
