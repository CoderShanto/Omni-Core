import mongoose, { Schema, Document } from 'mongoose';

export type PlanTier = 'Free Trial' | 'Starter' | 'Business' | 'Enterprise';
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing';

export interface ISubscription extends Document {
  companyId: mongoose.Types.ObjectId;
  plan: PlanTier;
  status: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  seatLimit: number;
  projectLimit: number;
  aiQueryLimit: number;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema: Schema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, unique: true, index: true },
    plan: { 
      type: String, 
      enum: ['Free Trial', 'Starter', 'Business', 'Enterprise'], 
      default: 'Free Trial',
      required: true 
    },
    status: { 
      type: String, 
      enum: ['active', 'past_due', 'canceled', 'trialing'], 
      default: 'active',
      required: true 
    },
    stripeCustomerId: { type: String, default: '' },
    stripeSubscriptionId: { type: String, default: '' },
    seatLimit: { type: Number, required: true, default: 5 },
    projectLimit: { type: Number, required: true, default: 10 },
    aiQueryLimit: { type: Number, required: true, default: 50 },
    currentPeriodEnd: { type: Date, required: true, default: () => new Date(Date.now() + 30 * 86400000) }
  },
  { timestamps: true }
);

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
