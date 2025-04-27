// src/models/colorModel.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IColor extends Document {
  name: string;
  hexCode: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const colorSchema: Schema<IColor> = new Schema(
  {
    name: { type: String, required: true, unique: true },
    hexCode: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IColor>('Color', colorSchema, 'colors');