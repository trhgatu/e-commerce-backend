import mongoose from 'mongoose';
import { PaymentMethod } from '../../models/orderModel';

export interface OrderItemInput {
  inventoryId: mongoose.Types.ObjectId | string;
  productId: mongoose.Types.ObjectId | string;
  colorId?: mongoose.Types.ObjectId | string;
  size?: string;
  quantity: number;
  price: number;
}

export interface ShippingInfoInput {
  fullName: string;
  phone: string;
  address: string;
}

export interface CreateOrderInput {
  items: OrderItemInput[];
  total?: number;
  userId?: mongoose.Types.ObjectId | string;
  voucherCode?: string;
  voucherId?: mongoose.Types.ObjectId;
  discount?: number;
  finalTotal?: number;

  paymentMethod: PaymentMethod;
  note?: string;
  shippingInfo: ShippingInfoInput;

  createdBy?: mongoose.Types.ObjectId | string;
}
