import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
  items: { productId: mongoose.Types.ObjectId; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema: Schema<IOrder> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', orderSchema, 'orders');