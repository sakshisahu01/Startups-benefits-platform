import mongoose from 'mongoose';

export type ClaimStatus = 'pending' | 'approved' | 'rejected';

export interface IClaim {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  dealId: mongoose.Types.ObjectId;
  status: ClaimStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IClaimDocument extends IClaim, mongoose.Document {}

const claimSchema = new mongoose.Schema<IClaimDocument>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

claimSchema.index({ userId: 1, dealId: 1 }, { unique: true });
claimSchema.index({ userId: 1 });
claimSchema.index({ dealId: 1 });

export const Claim = mongoose.model<IClaimDocument>('Claim', claimSchema);
