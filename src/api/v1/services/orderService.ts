// src/services/orderService.ts
import Order, { IOrder, OrderStatus, PaymentStatus } from '../models/orderModel';
import Inventory from '../models/inventoryModel';
import { deleteKeysByPattern } from './redisService';
import mongoose from 'mongoose';

export const createOrder = async (data: Partial<IOrder>): Promise<IOrder> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('[DEBUG] full items:', data.items);
    for (const item of data.items || []) {
      const inventory = await Inventory.findById(item.inventoryId).session(session);

      if (!inventory || inventory.quantity < item.quantity) {
        throw new Error(`Not enough stock for item ${item.productId}`);
      }

      inventory.quantity -= item.quantity;
      await inventory.save({ session });
    }

    const order = new Order(data);
    const saved = await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    await deleteKeysByPattern('orders:*');
    return saved;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getOrderById = async (id: string): Promise<IOrder | null> => {
  return await Order.findById(id)
    .populate('userId', 'fullName email')
    .populate('items.productId', 'name price')
    .lean();
};

export const getUserOrders = async (userId: string): Promise<IOrder[]> => {
  return await Order.find({ userId })
    .sort({ createdAt: -1 })
    .lean();
};

export const updateOrderStatus = async (
  id: string,
  status: OrderStatus
): Promise<IOrder | null> => {
  const updated = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).lean();

  await deleteKeysByPattern('orders:*');
  return updated;
};

export const updatePaymentStatus = async (
  id: string,
  paymentStatus: PaymentStatus
): Promise<IOrder | null> => {
  const updated = await Order.findByIdAndUpdate(
    id,
    { paymentStatus },
    { new: true }
  ).lean();

  await deleteKeysByPattern('orders:*');
  return updated;
};

export const cancelOrder = async (id: string): Promise<IOrder | null> => {
  const order = await Order.findById(id);
  if (!order || order.status === OrderStatus.CANCELLED) return null;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const item of order.items) {
      await Inventory.findByIdAndUpdate(
        item.inventoryId,
        { $inc: { quantity: item.quantity } },
        { session }
      );
    }

    order.status = OrderStatus.CANCELLED;
    const saved = await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    await deleteKeysByPattern('orders:*');
    return saved;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
