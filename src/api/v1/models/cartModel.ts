import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  inventoryId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  colorId?: mongoose.Types.ObjectId;
  size?: string;
  quantity: number;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  isCheckedOut?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        inventoryId: { type: Schema.Types.ObjectId, ref: 'Inventory', required: true },
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        colorId: { type: Schema.Types.ObjectId, ref: 'Color' },
        size: { type: String },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    isCheckedOut: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Cart = mongoose.model<ICart>('Cart', cartSchema, 'carts');
export default Cart;
