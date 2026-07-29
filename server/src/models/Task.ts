import mongoose, { Schema, Document } from 'mongoose';

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TaskStatus = 'Todo' | 'Doing' | 'Review' | 'Done';

export interface ITask extends Document {
  companyId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  priority: TaskPriority;
  deadline: Date;
  status: TaskStatus;
  assignedTo?: mongoose.Types.ObjectId;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', default: null, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    priority: { 
      type: String, 
      enum: ['Low', 'Medium', 'High', 'Critical'], 
      default: 'Medium',
      required: true 
    },
    deadline: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ['Todo', 'Doing', 'Review', 'Done'], 
      default: 'Todo',
      required: true 
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'Employee', default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default mongoose.model<ITask>('Task', TaskSchema);
