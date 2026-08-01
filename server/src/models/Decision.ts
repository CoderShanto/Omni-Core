import mongoose, { Schema, Document } from 'mongoose';

export interface IDecision extends Document {
  companyId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  madeBy: mongoose.Types.ObjectId;
  status: 'Proposed' | 'Approved' | 'Rejected' | 'Implemented';
  createdAt: Date;
  updatedAt: Date;
}

const DecisionSchema: Schema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    madeBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['Proposed', 'Approved', 'Rejected', 'Implemented'],
      default: 'Proposed',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IDecision>('Decision', DecisionSchema);
