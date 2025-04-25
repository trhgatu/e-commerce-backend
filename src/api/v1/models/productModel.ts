import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  description?: string;
  images: string[];
  thumbnail?: string;
  createdAt: Date;
  updatedAt?: Date; // Thêm để khớp timestamps
}

const productSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    images: { type: [String] },
    thumbnail: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // Tự động thêm createdAt, updatedAt
);

const Product = mongoose.model<IProduct>('Product', productSchema, 'products');

export default Product;