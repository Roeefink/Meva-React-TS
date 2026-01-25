import { Router } from 'express';
import infoRouter from './info.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is running' });
});

// Info routes
router.use('/info', infoRouter);

// Chat routes
import chatRouter from './chat.js';
router.use('/chat', chatRouter);

export default router;
