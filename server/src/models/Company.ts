import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  industry: string;
  address?: string;
  email?: string;
  phone?: string;
  customLogo?: string;
  primaryColor?: string;
  customDomain?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    address: { type: String, default: '' },
    email: { type: String, default: '', lowercase: true, trim: true },
    phone: { type: String, default: '' },
    customLogo: { type: String, default: '' },
    primaryColor: { type: String, default: '#6366f1' },
    customDomain: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model<ICompany>('Company', CompanySchema);
