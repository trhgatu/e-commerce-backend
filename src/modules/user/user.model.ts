// src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  PENDING = 'pending',
}
export interface UserPayload {
  _id: string;
  email: string;
  fullName: string;
  username: string;
  roleId?: string;
  status: UserStatus;
}
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  status: UserStatus;
  fullName: string;
  username: string;
  phone?: string;
  avatarUrl?: string;
  address?: string;
  gender: 'male' | 'female' | 'other';
  birthDate?: Date;
  roleId?: mongoose.Types.ObjectId;
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
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'other',
    },
    birthDate: { type: Date },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    emailVerified: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>('User', userSchema, 'users');
export default User;
