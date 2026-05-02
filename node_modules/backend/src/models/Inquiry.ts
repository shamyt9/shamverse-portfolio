import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiry extends Document {
  name: string;
  email: string;
  message: string;
  status: 'read' | 'unread';
}

const InquirySchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['read', 'unread'], default: 'unread' }
}, { timestamps: true });

export default mongoose.model<IInquiry>('Inquiry', InquirySchema);
