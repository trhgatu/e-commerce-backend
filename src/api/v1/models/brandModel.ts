import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';

export interface IBrand extends Document {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const brandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    logo: { type: String },
  },
  { timestamps: true }
);

brandSchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Brand =  mongoose.model<IBrand>('Brand', brandSchema, 'brands');

export default Brand;