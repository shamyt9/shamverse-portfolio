import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
    title: string;
    description: string;
    image: string;
    liveLink: string;
    githubLink: string;
    tags: string[];
    featured: boolean;
    category: 'web' | 'android' | 'software' | 'ml' | 'ai' | 'other';
}

const ProjectSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        liveLink: { type: String },
        githubLink: { type: String },
        tags: [{ type: String }],
        featured: { type: Boolean, default: false },
        category: {
            type: String,
            enum: ['web', 'android', 'software', 'ml', 'ai', 'other'],
            default: 'web',
        },
    },
    { timestamps: true },
);

export default mongoose.model<IProject>('Project', ProjectSchema);
