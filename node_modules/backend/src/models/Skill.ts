import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: string;
  level: number;
  image?: string;
}

const SkillSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // Frontend, Backend, Tools, etc.
  level: { type: Number, required: true, min: 0, max: 100 },
  image: { type: String }
}, { timestamps: true });

export default mongoose.model<ISkill>('Skill', SkillSchema);
