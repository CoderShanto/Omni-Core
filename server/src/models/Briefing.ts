import mongoose, { Schema, Document } from 'mongoose';

export interface IBriefing extends Document {
  companyId: mongoose.Types.ObjectId;
  type: 'Daily' | 'Weekly';
  date: Date;
  content: string; // The generated summary
  readBy: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const BriefingSchema: Schema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    type: { type: String, enum: ['Daily', 'Weekly'], required: true },
    date: { type: Date, required: true },
    content: { type: String, required: true },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IBriefing>('Briefing', BriefingSchema);
