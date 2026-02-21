
import mongoose, { Document } from 'mongoose';

export interface IChatSession extends Document {
    user_id: string;
    title: string; // explicitly string
    created_at: Date;
    updated_at: Date;
}

const chatSessionSchema = new mongoose.Schema({
    user_id: { type: String, required: true, index: true },
    title: { type: String, required: true, default: 'New Chat' },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const ChatSession = mongoose.model<IChatSession>('ChatSession', chatSessionSchema);
