import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  price: number;
  description?: string;
  images: string[];
  thumbnail?: string;
  tags?: string[];
  stock: number;
  colorVariants: {
    colorId: mongoose.Types.ObjectId;
    stock: number;
  }[];
  categoryId: mongoose.Types.ObjectId;
  brand: string;
  isFeatured: boolean;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
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
    stock: { type: Number, default: 0, min: 0 },

    colorVariants: [
      {
        colorId: {
          type: Schema.Types.ObjectId,
          ref: 'Color',
          required: true,
        },
        stock: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    brand: { type: String, required: true, trim: true },
    isFeatured: { type: Boolean, default: false },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);
productSchema.pre('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }
  next();
});

const Product = mongoose.model<IProduct>('Product', productSchema, 'products');

export default Product;
