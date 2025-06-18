import mongoose, { Schema, Document } from 'mongoose';

export enum ColorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface IColor extends Document {
  name: string;
  hexCode: string;
  description?: string;
  status: ColorStatus;
  isDeleted?: boolean;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  deletedBy: mongoose.Types.ObjectId;
}

const colorSchema: Schema<IColor> = new Schema(
  {
    name: { type: String, required: true, unique: true },
    hexCode: {
      type: String,
      required: true,
      match: /^#([0-9A-F]{3}){1,2}$/i,
      set: (val: string) => val.toLowerCase(),
    },
    description: { type: String },
    status: {
      type: String,
      enum: Object.values(ColorStatus),
      default: ColorStatus.ACTIVE,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Color = mongoose.model<IColor>('Color', colorSchema, 'colors');

export default Color;
