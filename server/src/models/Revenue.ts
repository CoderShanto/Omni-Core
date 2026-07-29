import mongoose, { Schema, Document } from 'mongoose';

export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue';

export interface IRevenue extends Document {
  companyId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  clientId?: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  paymentStatus: PaymentStatus;
  dueDate: Date;
  paidDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RevenueSchema: Schema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', default: null },
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', default: null },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, default: 0 },
    paymentStatus: { 
      type: String, 
      enum: ['Paid', 'Pending', 'Overdue'], 
      default: 'Pending',
      required: true 
    },
    dueDate: { type: Date, required: true },
    paidDate: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model<IRevenue>('Revenue', RevenueSchema);
