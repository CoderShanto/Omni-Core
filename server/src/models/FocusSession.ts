import mongoose, { Schema, Document } from 'mongoose';

export interface IFocusSession extends Document {
  companyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  taskId?: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  durationMinutes: number;
  interruptions: number;
  focusScore: number;
  createdAt: Date;
}

const FocusSessionSchema: Schema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', default: null },
    startTime: { type: Date, required: true },
    endTime: { type: Date, default: null },
    durationMinutes: { type: Number, default: 0 },
    interruptions: { type: Number, default: 0 },
    focusScore: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IFocusSession>('FocusSession', FocusSessionSchema);
