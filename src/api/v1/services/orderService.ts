// src/services/orderService.ts
import Order, { IOrder, OrderStatus, PaymentStatus } from '../models/orderModel';
import { validateVoucherUsage, increaseVoucherUsage } from './voucherService';
import { CreateOrderInput } from '../types/order/orderDTO';
import Inventory from '../models/inventoryModel';
import { deleteKeysByPattern } from './redisService';
import mongoose from 'mongoose';

export const createOrder = async (data: CreateOrderInput): Promise<IOrder> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, voucherCode, userId, total } = data;

    if (!items || items.length === 0) {
      throw new Error('Đơn hàng phải có ít nhất 1 sản phẩm');
    }

    for (const item of items) {
      const inventory = await Inventory.findById(item.inventoryId).session(session);

      if (!inventory || inventory.quantity < item.quantity) {
        throw new Error(`Không đủ tồn kho cho sản phẩm ${item.productId}`);
      }

      inventory.quantity -= item.quantity;
      await inventory.save({ session });
    }

    if (voucherCode) {
      const { discount, finalTotal, voucher } = await validateVoucherUsage(
        voucherCode,
        userId?.toString() || '',
        total || 0
      );

      data.voucherId = voucher._id;
      data.discount = discount;
      data.finalTotal = finalTotal;
    } else {
      data.discount = 0;
      data.finalTotal = total;
    }

    const order = new Order(data);
    const saved = await order.save({ session });

    if (voucherCode && data.voucherId) {
      await increaseVoucherUsage(data.voucherId.toString(), userId?.toString() || '');
    }

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

  if (!updated) throw new Error('Order not found');

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
