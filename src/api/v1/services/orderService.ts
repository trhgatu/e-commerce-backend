// src/services/orderService.ts
import OrderModel, { IOrder, OrderStatus, PaymentStatus } from '../models/orderModel';
import { IProduct } from '../models/productModel';
import { getCache, setCache } from './redisService';
import { validateVoucherUsage, increaseVoucherUsage } from './voucherService';
import { CreateOrderInput } from '../types/order/orderDTO';
import InventoryModel from '../models/inventoryModel';
import { deleteKeysByPattern } from './redisService';
import mongoose from 'mongoose';
import { paginate } from '../utils';

export const getAllOrders = async (
  page: number,
  limit: number,
  filters: Record<string, any> = {},
  sort: Record<string, 1 | -1> = {}
) => {
  const finalFilters: Record<string, any> = {
    isDeleted: false,
    ...filters,
  };

  const cacheKey = `orders:page=${page}:limit=${limit}:filters=${JSON.stringify(
    finalFilters
  )}:sort=${JSON.stringify(sort)}`;

  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const result = await paginate<IOrder>(
    OrderModel,
    { page, limit },
    finalFilters,
    sort,
    [
      { path: 'userId', select: 'fullName email' },
      { path: 'colorId', select: 'name hexCode' },
      { path: 'items.productId', select: 'name price' },
      { path: 'voucherId', select: 'code value' },
    ]
  );

  await setCache(cacheKey, result);
  return result;
};
export const createOrder = async (
  data: CreateOrderInput,
  userId: string
): Promise<IOrder> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, voucherCode } = data;

    if (!items || items.length === 0) {
      throw new Error('Đơn hàng phải có ít nhất 1 sản phẩm');
    }

    let calculatedTotal = 0;

    for (const item of items) {
      const inventory = await InventoryModel.findById(item.inventoryId)
        .populate<{ productId: IProduct }>('productId')
        .session(session);

      if (!inventory || inventory.quantity < item.quantity) {
        throw new Error(`Không đủ tồn kho cho sản phẩm ${item.productId}`);
      }
      const product = inventory.productId;
      const productPrice = product.price;
      item.price = productPrice;
      calculatedTotal += productPrice * item.quantity;

      inventory.quantity -= item.quantity;
      await inventory.save({ session });
    }


    if (voucherCode) {
      const { discount, finalTotal, voucher } = await validateVoucherUsage(
        voucherCode,
        userId,
        calculatedTotal || 0
      );

      data.voucherId = voucher._id;
      data.discount = discount;
      data.finalTotal = finalTotal;
    } else {
      data.discount = 0;
      data.finalTotal = calculatedTotal;
    }

    data.userId = userId;
    data.createdBy = userId;

    const order = new OrderModel(data);
    const saved = await order.save({ session });

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
  status: OrderStatus,
  userId: string
): Promise<IOrder | null> => {
  const updated = await OrderModel.findByIdAndUpdate(
    id,
    { status, updatedBy: userId },
    { new: true }
  ).lean();

  await deleteKeysByPattern('orders:*');
  return updated;
};

export const updatePaymentStatus = async (
  id: string,
  paymentStatus: PaymentStatus,
  userId: string
): Promise<IOrder | null> => {
  const updated = await OrderModel.findByIdAndUpdate(
    id,
    { paymentStatus, updatedBy: userId },
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
