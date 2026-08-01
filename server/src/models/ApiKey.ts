import mongoose, { Schema, Document } from 'mongoose';

export interface IApiKey extends Document {
  companyId: mongoose.Types.ObjectId;
  name: string;
  keyPrefix: string;
  keyHash: string;
  createdBy: mongoose.Types.ObjectId;
  lastUsed?: Date;
  isRevoked: boolean;
  createdAt: Date;
}

const ApiKeySchema: Schema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    name: { type: String, required: true },
    keyPrefix: { type: String, required: true }, // Store first 4-8 chars for display
    keyHash: { type: String, required: true }, // Hashed full key
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lastUsed: { type: Date, default: null },
    isRevoked: { type: Boolean, default: false }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IApiKey>('ApiKey', ApiKeySchema);
