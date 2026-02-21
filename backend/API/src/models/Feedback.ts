
import mongoose, { Document } from 'mongoose';

export interface IFeedback extends Document {
    name: string;
    email: string;
    message: string;
    created_at: Date;
    updated_at: Date;
}

const feedbackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export const Feedback = mongoose.model<IFeedback>('Feedback', feedbackSchema);
