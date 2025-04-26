import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  description?: string;
  images: string[];
  thumbnail?: string;
  createdAt: Date;
  updatedAt?: Date;
  stock: number;
  categoryId: mongoose.Types.ObjectId;
}

const productSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    images: { type: [String] },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    stock: { type: Number, default: 0 },
    thumbnail: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>('Product', productSchema, 'products');

export default Product;