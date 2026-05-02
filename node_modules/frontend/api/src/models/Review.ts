import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
    clientName: string;
    clientEmail: string;
    clientDesignation?: string;
    workDescription: string;
    reviewText: string;
    rating: number;
    isVisible: boolean;
}

const ReviewSchema: Schema = new Schema(
    {
        clientName: { type: String, required: true },
        clientEmail: { type: String, required: true },
        clientDesignation: { type: String },
        workDescription: { type: String, required: true },
        reviewText: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        isVisible: { type: Boolean, default: false },
    },
    { timestamps: true },
);

export default mongoose.model<IReview>('Review', ReviewSchema);
