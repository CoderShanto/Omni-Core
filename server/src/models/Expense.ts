import mongoose, { Schema, Document } from 'mongoose';

export type ExpenseCategory = 'Software' | 'Travel' | 'Hardware' | 'Office' | 'Marketing' | 'Other';
export type ExpenseStatus = 'Pending' | 'Approved' | 'Rejected';

export interface IExpense extends Document {
  companyId: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  category: ExpenseCategory;
  amount: number;
  description: string;
  receiptUrl?: string;
  status: ExpenseStatus;
  approvedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true, index: true },
    category: { 
      type: String, 
      enum: ['Software', 'Travel', 'Hardware', 'Office', 'Marketing', 'Other'], 
      default: 'Office',
      required: true 
    },
    amount: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    receiptUrl: { type: String, default: '' },
    status: { 
      type: String, 
      enum: ['Pending', 'Approved', 'Rejected'], 
      default: 'Pending',
      required: true 
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

export default mongoose.model<IExpense>('Expense', ExpenseSchema);
