import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';

export enum ProductStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  price: number;
  description?: string;
  images: string[];
  thumbnail?: string;
  tags?: string[];
  status: ProductStatus;
  categoryId: mongoose.Types.ObjectId;
  brandId: mongoose.Types.ObjectId;
  isFeatured: boolean;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  totalStock: number;
  sold: number;
  hasVariants: boolean;
  availableColors?: mongoose.Types.ObjectId[];
  availableSizes?: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  deletedBy: mongoose.Types.ObjectId;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    images: { type: [String], default: [] },
    thumbnail: { type: String },
    tags: { type: [String], default: [] },

    status: {
      type: String,
      enum: Object.values(ProductStatus),
      default: ProductStatus.DRAFT,
      required: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },

    isFeatured: { type: Boolean, default: false },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },

    totalStock: { type: Number, default: 0 },
    sold: { type: Number, default: 0, min: 0 },
    hasVariants: { type: Boolean, default: false },
    availableColors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Color'
      }
    ],
    availableSizes: [{ type: String }],

    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },

  },
  { timestamps: true }
);

productSchema.pre('validate', async function (next) {
  if (!this.isModified('name') && !this.isNew) return next();

  const baseSlug = slugify(this.name, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (await Product.exists({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
  next();
});

const Product = mongoose.model<IProduct>('Product', productSchema, 'products');
export default Product;
