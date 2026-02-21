
import mongoose, { Document } from 'mongoose';

export interface IChatMessage extends Document {
    user_id: string;
    session_id: mongoose.Types.ObjectId;
    sender: 'user' | 'bot'; // explicitly string
    content: string; // explicitly string
    created_at: Date;
    updated_at: Date;
}

const chatMessageSchema = new mongoose.Schema({
    user_id: { type: String, required: true, index: true },
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession', required: true, index: true },
    sender: { type: String, enum: ['user', 'bot'], required: true },
    content: { type: String, required: true }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);
