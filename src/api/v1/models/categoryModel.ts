import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  parentId?: mongoose.Types.ObjectId;
  description?: string;
  icon?: string;
}

const categorySchema: Schema<ICategory> = new Schema(
  {
    name: { type: String, required: true, unique: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Category' },
    description: { type: String },
    icon: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>('Category', categorySchema, 'categories');