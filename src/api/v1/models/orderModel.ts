import mongoose, { Schema, Document } from 'mongoose';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  REFUNDED = 'refunded'
}

export enum PaymentMethod {
  COD = 'cod',
  MOMO = 'momo',
  VNPAY = 'vnpay'
}
export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: {
    inventoryId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    colorId?: mongoose.Types.ObjectId;
    size?: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: OrderStatus;
  note: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingInfo: {
    fullName: string;
    phone: string;
    address: string;
  };
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean
}

const orderSchema: Schema<IOrder> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        inventoryId: { type: Schema.Types.ObjectId, ref: 'Inventory', required: true },
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        colorId: { type: Schema.Types.ObjectId, ref: 'Color' },
        size: { type: String },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },

    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING
    },

    note: { type: String },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.UNPAID,
    },

    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.COD,
    },

    shippingInfo: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>('Order', orderSchema, 'orders');

export default Order;
