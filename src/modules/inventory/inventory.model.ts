import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  productId: mongoose.Types.ObjectId;
  colorId?: mongoose.Types.ObjectId;
  size?: string;
  minQuantity?: number;
  maxQuantity?: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
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
    minQuantity: {
      type: Number,
      required: false,
      default: 0,
      min: 0,
    },
    maxQuantity: {
      type: Number,
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

inventorySchema.index(
  { productId: 1, colorId: 1, size: 1 },
  { unique: true, sparse: true }
);

const Inventory = mongoose.model<IInventory>(
  'Inventory',
  inventorySchema,
  'inventories'
);
export default Inventory;
