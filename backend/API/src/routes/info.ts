import express from 'express';
import type { Response } from 'express';
import { supabase } from '../config/supabase.js';
import { authenticate } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get all info_test items for authenticated user
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('info_test')
            .select('*')
            .eq('user_id', req.user!.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Create new info_test item
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        const { data, error } = await supabase
            .from('info_test')
            .insert([{
                title,
                description,
                user_id: req.user!.id
            }])
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Update info_test item
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const { data, error } = await supabase
            .from('info_test')
            .update({ title, description })
            .eq('id', id)
            .eq('user_id', req.user!.id)
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Delete info_test item
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('info_test')
            .delete()
            .eq('id', id)
            .eq('user_id', req.user!.id);

        if (error) throw error;

        res.json({ success: true, message: 'Item deleted' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
