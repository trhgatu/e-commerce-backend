import mongoose, { Schema, Document } from 'mongoose';

export enum VoucherType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage'
}

export interface IVoucher extends Document {
  code: string;
  type: VoucherType;
  value: number;
  minOrderValue?: number;
  maxDiscountValue?: number;
  usageLimit?: number;
  usageCount: number;
  usagePerUser?: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const voucherSchema = new Schema<IVoucher>(
  {
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    type: { type: String, enum: Object.values(VoucherType), required: true },
    value: { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    maxDiscountValue: { type: Number },
    usageLimit: { type: Number },
    usageCount: { type: Number, default: 0 },
    usagePerUser: { type: Number, default: 1 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Voucher = mongoose.model<IVoucher>('Voucher', voucherSchema, 'vouchers');
export default Voucher;
