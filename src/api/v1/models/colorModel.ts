// src/models/colorModel.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IColor extends Document {
  name: string;
  hexCode: string;
  description?: string;
}

const colorSchema: Schema<IColor> = new Schema(
  {
    name: { type: String, required: true, unique: true },
    hexCode: { type: String, required: true , match: /^#([0-9A-F]{3}){1,2}$/i},
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IColor>('Color', colorSchema, 'colors');