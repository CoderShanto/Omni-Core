import mongoose, { Schema, Document } from 'mongoose';

export interface IKnowledgeEdge extends Document {
  companyId: mongoose.Types.ObjectId;
  sourceType: string;
  sourceId: mongoose.Types.ObjectId;
  targetType: string;
  targetId: mongoose.Types.ObjectId;
  relationshipType: string;
  createdAt: Date;
}

const KnowledgeEdgeSchema: Schema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    sourceType: { type: String, required: true },
    sourceId: { type: Schema.Types.ObjectId, required: true },
    targetType: { type: String, required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    relationshipType: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

KnowledgeEdgeSchema.index({ companyId: 1, sourceId: 1, targetId: 1 }, { unique: true });

export default mongoose.model<IKnowledgeEdge>('KnowledgeEdge', KnowledgeEdgeSchema);
