import mongoose, { Schema, Document } from 'mongoose';

export interface IPrice extends Document {
  serviceName: string;
  price: string;
  features: string[];
  images: string[];
}

const PriceSchema: Schema = new Schema({
  serviceName: { type: String, required: true },
  price: { type: String, required: true },
  features: [{ type: String }],
  images: [{ type: String }]
}, { timestamps: true });

export default mongoose.model<IPrice>('Price', PriceSchema);
