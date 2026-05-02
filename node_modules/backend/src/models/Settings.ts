import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  position: string;
  logo: string;
  heroImage: string;
  bio: string;
  contact: {
    email?: string;
    whatsapp?: string;
    phone?: string;
    location?: string;
  };
  socialLinks: {
    github?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
}

const SettingsSchema: Schema = new Schema({
  siteName: { type: String, default: 'ShamVerse' },
  heroTitle: { type: String, required: true },
  heroSubtitle: { type: String, required: true },
  position: { type: String, default: 'AI Engineer' },
  logo: { type: String },
  heroImage: { type: String },
  bio: { type: String, required: true },
  contact: {
    email: { type: String },
    whatsapp: { type: String },
    phone: { type: String },
    location: { type: String },
  },
  socialLinks: {
    github: { type: String },
    linkedin: { type: String },
    instagram: { type: String },
    youtube: { type: String },
  }
}, { timestamps: true });

export default mongoose.model<ISettings>('Settings', SettingsSchema);
