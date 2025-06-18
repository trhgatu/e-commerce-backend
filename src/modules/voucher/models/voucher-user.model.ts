// src/api/v1/models/userVoucherModel.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUserVoucher extends Document {
  userId: mongoose.Types.ObjectId;
  voucherId: mongoose.Types.ObjectId;
  usedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const userVoucherSchema = new Schema<IUserVoucher>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    voucherId: { type: Schema.Types.ObjectId, ref: 'Voucher', required: true },
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const UserVoucherModel = mongoose.model<IUserVoucher>(
  'UserVoucher',
  userVoucherSchema,
  'user_vouchers'
);

export default UserVoucherModel;
