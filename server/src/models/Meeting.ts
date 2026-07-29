import mongoose, { Schema, Document } from 'mongoose';

export interface IActionItem {
  task: string;
  owner?: string;
  completed: boolean;
}

export interface IMeeting extends Document {
  companyId: mongoose.Types.ObjectId;
  title: string;
  summary: string;
  actionItems: IActionItem[];
  projectId?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ActionItemSchema: Schema = new Schema({
  task: { type: String, required: true, trim: true },
  owner: { type: String, default: '' },
  completed: { type: Boolean, default: false }
});

const MeetingSchema: Schema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true },
    actionItems: [ActionItemSchema],
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IMeeting>('Meeting', MeetingSchema);
