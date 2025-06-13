import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  productId: mongoose.Types.ObjectId;
  colorId?: mongoose.Types.ObjectId;
  size?: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventory>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    colorId: {
      type: Schema.Types.ObjectId,
      ref: 'Color',
      required: false,
    },
    size: {
      type: String,
      required: false,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const Inventory = mongoose.model<IInventory>('Inventory', inventorySchema, 'inventories');
export default Inventory;
