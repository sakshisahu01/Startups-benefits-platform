import mongoose from 'mongoose';

export type AccessLevel = 'public' | 'locked';

export interface IDeal {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  category: string;
  accessLevel: AccessLevel;
  partnerName: string;
  partnerUrl?: string;
  partnerLogoUrl?: string;
  eligibility: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDealDocument extends IDeal, mongoose.Document {}

const dealSchema = new mongoose.Schema<IDealDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    accessLevel: { type: String, enum: ['public', 'locked'], default: 'public' },
    partnerName: { type: String, required: true },
    partnerUrl: String,
    partnerLogoUrl: String,
    eligibility: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

dealSchema.index({ slug: 1 });
dealSchema.index({ category: 1 });
dealSchema.index({ accessLevel: 1 });
dealSchema.index({ isActive: 1 });

export const Deal = mongoose.model<IDealDocument>('Deal', dealSchema);
