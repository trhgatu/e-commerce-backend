import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';

export enum BrandStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

export interface IBrand extends Document {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  status: BrandStatus;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
}

const brandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    logo: { type: String },
    status: {
      type: String,
      enum: Object.values(BrandStatus),
      default: BrandStatus.ACTIVE,
      required: true,
    },

    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

brandSchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Brand = mongoose.model<IBrand>('Brand', brandSchema, 'brands');

export default Brand;