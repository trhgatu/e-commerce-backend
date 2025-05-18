import mongoose, { Schema, Document } from 'mongoose';

export interface IColor extends Document {
  name: string;
  hexCode: string;
  description?: string;
  isDeleted?: boolean;
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
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Color = mongoose.model<IColor>('Color', colorSchema, 'colors');
export default Color;
