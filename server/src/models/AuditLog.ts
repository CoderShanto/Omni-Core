import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  companyId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  userRole: string;
  action: string;
  entity: string;
  ipAddress: string;
  details: string;
  createdAt: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', default: null, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userRole: { type: String, required: true },
    action: { type: String, required: true, index: true },
    entity: { type: String, required: true },
    ipAddress: { type: String, default: '127.0.0.1' },
    details: { type: String, default: '' }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
