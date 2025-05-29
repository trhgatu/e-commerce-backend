// src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  status: 'active' | 'inactive' | 'banned';
  fullName: string;
  username: string;
  phone?: string;
  avatarUrl?: string;
  address?: string;
  gender: 'male' | 'female' | 'other';
  birthDate?: Date;
  roleId?: mongoose.Types.ObjectId;
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
    status: { type: String, enum: ['active', 'inactive', 'banned'], default: 'active' },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
    birthDate: { type: Date },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
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
