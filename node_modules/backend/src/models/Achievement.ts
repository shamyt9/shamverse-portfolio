import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  title: string;
  issuer: string;
  date: Date;
  image: string;
  description?: string;
}

const AchievementSchema: Schema = new Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: Date, required: true },
  image: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

export default mongoose.model<IAchievement>('Achievement', AchievementSchema);
