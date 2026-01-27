import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Load .env relative to this script
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const gmailUser = process.env.GMAIL_USER;
const gmailPass = process.env.GMAIL_APP_PASSWORD;

console.log('Testing Gmail Connection...');
console.log('User:', gmailUser);
// console.log('Pass:', gmailPass);

async function testEmail() {
    if (!gmailUser || !gmailPass) {
        console.error('❌ Missing Gmail credentials');
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: gmailUser,
                pass: gmailPass
            }
        });

        // Verify connection config
        await transporter.verify();
        console.log('✅ SMTP Connection Successful!');

        // Attempt search (optional, verify is usually enough)
    } catch (err) {
        console.error('❌ SMTP Connection Failed:', err);
    }
}

testEmail();
