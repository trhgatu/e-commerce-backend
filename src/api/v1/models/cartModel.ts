import mongoose, { Schema, Document } from 'mongoose';

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: { productId: mongoose.Types.ObjectId; quantity: number }[];
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema: Schema<ICart> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<ICart>('Cart', cartSchema, 'carts');