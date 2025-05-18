// src/services/orderService.ts
import OrderModel, { IOrder } from '../models/orderModel';
import mongoose from 'mongoose';

export const createOrder = async (data: Partial<IOrder>): Promise<IOrder> => {
  const order = new OrderModel(data);
  return await order.save();
};

export const getOrdersByUserId = async (userId: string): Promise<IOrder[]> => {
  return await OrderModel.find({ userId: new mongoose.Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .lean();
};

export const getAllOrders = async (): Promise<IOrder[]> => {
  return await OrderModel.find()
    .sort({ createdAt: -1 })
    .lean();
};

export const getOrderById = async (id: string): Promise<IOrder | null> => {
  return await OrderModel.findById(id).lean();
};

export const updateOrderStatus = async (
  id: string,
  status: IOrder['status']
): Promise<IOrder | null> => {
  return await OrderModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).lean();
};

export const updatePaymentStatus = async (
  id: string,
  paymentStatus: IOrder['paymentStatus']
): Promise<IOrder | null> => {
  return await OrderModel.findByIdAndUpdate(
    id,
    { paymentStatus },
    { new: true }
  ).lean();
};

export const deleteOrder = async (id: string): Promise<IOrder | null> => {
  return await OrderModel.findByIdAndDelete(id).lean();
};
