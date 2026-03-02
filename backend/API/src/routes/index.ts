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

// Feedback routes
import feedbackRouter from './feedback.js';
router.use('/feedback', feedbackRouter);

// Patients routes
import patientsRouter from './patients.js';
router.use('/patients', patientsRouter);

export default router;
