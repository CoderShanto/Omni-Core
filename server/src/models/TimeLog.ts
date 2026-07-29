import mongoose, { Schema, Document } from 'mongoose';

export interface ITimeLog extends Document {
  companyId: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  taskId?: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  durationMinutes: number;
  isBillable: boolean;
  hourlyRate: number;
  date: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const TimeLogSchema: Schema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true, index: true },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', default: null },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', default: null },
    durationMinutes: { type: Number, required: true, default: 0 },
    isBillable: { type: Boolean, default: true },
    hourlyRate: { type: Number, default: 50 },
    date: { type: Date, required: true, default: Date.now },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model<ITimeLog>('TimeLog', TimeLogSchema);
