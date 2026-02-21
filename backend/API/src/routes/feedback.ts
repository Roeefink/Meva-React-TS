
import express from 'express';
import type { Request, Response } from 'express';
import { Feedback } from '../models/Feedback.js';
import { Resend } from 'resend';

const router = express.Router();

// POST /api/v1/feedback
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }

        // Insert into MongoDB (Backup/Log)
        try {
            await Feedback.create({ name, email, message });
        } catch (error: any) {
            console.error('MongoDB feedback insert error:', error);
            // Non-blocking error, we still try to send email
        }

        // Send Email via Resend (HTTP)
        if (process.env.RESEND_API_KEY) {
            const resend = new Resend(process.env.RESEND_API_KEY);

            resend.emails.send({
                from: 'Meva Medical <onboarding@resend.dev>', // Default testing domain
                to: 'mevamedicalusa@gmail.com',
                subject: `New Feedback from ${name}`,
                replyTo: email,
                html: `
                    <h3>New Feedback Received</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <hr/>
                    <p><strong>Message:</strong></p>
                    <p>${message.replace(/\n/g, '<br/>')}</p>
                `
            }).then((response: any) => {
                if (response.error) {
                    console.error('Failed to send email (Resend):', response.error);
                } else {
                    console.log(`Email sent to mevamedicalusa@gmail.com. ID: ${response.data?.id}`);
                }
            }).catch((emailError: any) => {
                console.error('Unexpected error sending email:', emailError);
            });
        } else {
            console.warn('Skipping email: RESEND_API_KEY not set.');
        }

        res.status(201).json({ message: 'Feedback received successfully' });
    } catch (error: any) {
        console.error('Error processing feedback:', error);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});

export default router;
