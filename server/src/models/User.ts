import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'Super Admin' | 'CEO' | 'Manager' | 'Employee';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  companyId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['Super Admin', 'CEO', 'Manager', 'Employee'], 
      default: 'Employee',
      required: true 
    },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', default: null }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
