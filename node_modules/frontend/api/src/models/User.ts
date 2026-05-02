import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  password: string;
  comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

UserSchema.pre('save', async function () {
  const user = this as any;
  if (!user.isModified('password')) return;
  user.password = await bcrypt.hash(user.password, 10);
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
