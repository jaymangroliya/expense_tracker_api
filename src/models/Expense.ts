import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IExpense extends Document {
  userId: Types.ObjectId;
  amount: number;
  category: string;
  description: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

const expenseSchema = new Schema<IExpense>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
});

export default mongoose.model<IExpense>('Expense', expenseSchema);