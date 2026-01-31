import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, mongoose.Document {}

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    name: { type: String, required: true, trim: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = mongoose.model<IUserDocument>('User', userSchema);
