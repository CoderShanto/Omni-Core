import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  companyId: mongoose.Types.ObjectId;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema: Schema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    name: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model<IClient>('Client', ClientSchema);
