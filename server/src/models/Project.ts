import mongoose, { Schema, Document } from 'mongoose';

export type ProjectStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';

export interface IProject extends Document {
  companyId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  budget: number;
  deadline: Date;
  status: ProjectStatus;
  team: mongoose.Types.ObjectId[];
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    budget: { type: Number, required: true, default: 0 },
    deadline: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'], 
      default: 'Pending',
      required: true 
    },
    team: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default mongoose.model<IProject>('Project', ProjectSchema);
