import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  role: 'admin' | 'employee';
  password: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'employee'] },
  password: { type: String, required: true }
});

export default mongoose.model<IUser>('User', userSchema);