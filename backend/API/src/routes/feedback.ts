
import express from 'express';
import type { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// POST /api/v1/feedback
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }

        // Insert into Supabase (Backup/Log)
        const { error } = await supabase
            .from('feedback')
            .insert([{ name, email, message }]);

        if (error) {
            console.error('Supabase feedback insert error:', error);
            // Non-blocking error, we still try to send email
        }

        // Send Email via Gmail
        if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_APP_PASSWORD
                },
                tls: {
                    rejectUnauthorized: false // Help with self-signed certs or strict firewalls
                }
            });

            // Non-blocking email sending
            transporter.sendMail({
                from: `"Meva Medical" <${process.env.GMAIL_USER}>`,
                to: 'mevamedicalusa@gmail.com',
                replyTo: email, // Reply directly to the user
                subject: `New Feedback from ${name}`,
                text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
                html: `
                        <h3>New Feedback Received</h3>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <hr/>
                        <p><strong>Message:</strong></p>
                        <p>${message.replace(/\n/g, '<br/>')}</p>
                    `
            }).then(() => {
                console.log(`Email sent to mevamedicalusa@gmail.com`);
            }).catch((emailError) => {
                console.error('Failed to send email:', emailError);
            });
        } else {
            console.warn('Skipping email: GMAIL_USER or GMAIL_APP_PASSWORD not set.');
        }

        res.status(201).json({ message: 'Feedback received successfully' });
    } catch (error: any) {
        console.error('Error processing feedback:', error);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});

export default router;
