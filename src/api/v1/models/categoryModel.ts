import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';


export enum CategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived'
}

export interface ICategory extends Document {
  name: string;
  slug: string;
  parentId?: mongoose.Types.ObjectId | null;
  description?: string;
  status: CategoryStatus,
  icon?: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema: Schema<ICategory> = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    description: { type: String },
    status: {
      type: String,
      enum: Object.values(CategoryStatus),
      default: CategoryStatus.ACTIVE,
      required: true,
    },

    icon: { type: String },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentId',
});

categorySchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Category = mongoose.model<ICategory>('Category', categorySchema, 'categories');

export default Category
