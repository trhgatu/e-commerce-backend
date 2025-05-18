// src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';
import { boolean } from 'zod';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;

  email: string;
  password: string;

  fullName: string;
  username: string;
  phone?: string;
  avatarUrl?: string;
  address?: string;
  gender: 'male' | 'female' | 'other';
  birthDate?: Date;

  role: 'user' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: Date;

  membershipRankId?: mongoose.Types.ObjectId;
  rewardPoints: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    fullName: { type: String, default: '' },
    username: { type: String, default: '' },
    phone: { type: String },
    avatarUrl: { type: String },
    address: { type: String },

    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
    birthDate: { type: Date },

    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    lastLoginAt: { type: Date },

    membershipRankId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rank' },
    rewardPoints: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>('User', userSchema, 'users');
export default User;
