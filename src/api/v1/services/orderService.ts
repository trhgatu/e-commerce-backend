// src/services/orderService.ts
import OrderModel, { IOrder, OrderStatus, PaymentStatus } from '../models/orderModel';
import { validateVoucherUsage, increaseVoucherUsage } from './voucherService';
import { CreateOrderInput } from '../types/order/orderDTO';
import InventoryModel from '../models/inventoryModel';
import { deleteKeysByPattern } from './redisService';
import mongoose from 'mongoose';

export const createOrder = async (
  data: CreateOrderInput,
  userId: string
): Promise<IOrder> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, voucherCode, total } = data;

    if (!items || items.length === 0) {
      throw new Error('Đơn hàng phải có ít nhất 1 sản phẩm');
    }

    // 1. Trừ tồn kho
    for (const item of items) {
      const inventory = await InventoryModel.findById(item.inventoryId).session(session);

      if (!inventory || inventory.quantity < item.quantity) {
        throw new Error(`Không đủ tồn kho cho sản phẩm ${item.productId}`);
      }

      inventory.quantity -= item.quantity;
      await inventory.save({ session });
    }

    // 2. Xử lý voucher (nếu có)
    if (voucherCode) {
      const { discount, finalTotal, voucher } = await validateVoucherUsage(
        voucherCode,
        userId,
        total || 0
      );

      data.voucherId = voucher._id;
      data.discount = discount;
      data.finalTotal = finalTotal;
    } else {
      data.discount = 0;
      data.finalTotal = total;
    }

    // 3. Gán createdBy rõ ràng
    data.createdBy = userId;

    // 4. Tạo đơn hàng
    const order = new OrderModel(data);
    const saved = await order.save({ session });

    // 5. Cập nhật lượt dùng voucher nếu có
    if (voucherCode && data.voucherId) {
      await increaseVoucherUsage(data.voucherId.toString(), userId);
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
  return await OrderModel.findById(id)
    .populate('userId', 'fullName email')
    .populate('items.productId', 'name price')
    .populate('voucherId', 'code')
    .lean();
};

export const getUserOrders = async (userId: string): Promise<IOrder[]> => {
  return await OrderModel.find({ userId })
    .sort({ createdAt: -1 })
    .lean();
};

export const updateOrderStatus = async (
  id: string,
  status: OrderStatus
): Promise<IOrder | null> => {
  const updated = await OrderModel.findByIdAndUpdate(
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
  const updated = await OrderModel.findByIdAndUpdate(
    id,
    { paymentStatus },
    { new: true }
  ).lean();

  if (!updated) throw new Error('Order not found');

  await deleteKeysByPattern('orders:*');
  return updated;
};

export const cancelOrder = async (id: string): Promise<IOrder | null> => {
  const order = await OrderModel.findById(id);
  if (!order || order.status === OrderStatus.CANCELLED) return null;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const item of order.items) {
      await InventoryModel.findByIdAndUpdate(
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
