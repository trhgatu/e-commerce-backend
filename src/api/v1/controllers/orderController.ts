import { Request, Response } from 'express';
import * as orderService from '../services/orderService';
import { handleError } from '../utils/handleError';
import mongoose from 'mongoose';

const controller = {
    createOrder: async (req: Request, res: Response) => {
        try {
            const userId = req.user?._id;
            if (!userId) throw new Error('User not authenticated');

            const { items, shippingInfo, paymentMethod, total, voucherCode } = req.body;

            const order = await orderService.createOrder({
                userId: new mongoose.Types.ObjectId(userId),
                items,
                shippingInfo,
                paymentMethod,
                total,
                voucherCode,
            });
            res.locals.targetId = order._id?.toString() || '';
            res.locals.description = `Created order: ${order._id}`;
            res.status(201).json({
                success: true,
                code: 201,
                message: 'Order created successfully',
                data: order,
            });
        } catch (error) {
            handleError(res, error, 'Failed to create order', 400);
        }
    },

    getOrderById: async (req: Request, res: Response) => {
        try {
            const order = await orderService.getOrderById(req.params.id);
            if (!order) {
                res.status(404).json({
                    success: false,
                    code: 404,
                    message: 'Order not found',
                });
                return;
            }

            res.status(200).json({
                success: true,
                code: 200,
                message: 'Order fetched successfully',
                data: order,
            });
        } catch (error) {
            handleError(res, error, 'Failed to fetch order', 400);
        }
    },

    getMyOrders: async (req: Request, res: Response) => {
        try {
            const userId = req.user?._id;
            if (!userId) throw new Error('User not authenticated');

            const orders = await orderService.getUserOrders(userId);
            res.status(200).json({
                success: true,
                code: 200,
                message: 'Orders fetched successfully',
                data: orders,
            });
        } catch (error) {
            handleError(res, error, 'Failed to fetch orders', 400);
        }
    },

    updateOrderStatus: async (req: Request, res: Response) => {
        try {
            const { status } = req.body;
            const updated = await orderService.updateOrderStatus(req.params.id, status);

            if (!updated) {
                res.status(404).json({
                    success: false,
                    code: 404,
                    message: 'Order not found or status not changed',
                });
                return;
            }

            res.status(200).json({
                success: true,
                code: 200,
                message: 'Order status updated successfully',
                data: updated,
            });
        } catch (error) {
            handleError(res, error, 'Failed to update order status', 400);
        }
    },

    updatePaymentStatus: async (req: Request, res: Response) => {
        try {
            const { paymentStatus } = req.body;
            const updated = await orderService.updatePaymentStatus(req.params.id, paymentStatus);

            if (!updated) {
                res.status(404).json({
                    success: false,
                    code: 404,
                    message: 'Order not found or payment status not changed',
                });
                return;
            }

            res.status(200).json({
                success: true,
                code: 200,
                message: 'Payment status updated successfully',
                data: updated,
            });
        } catch (error) {
            handleError(res, error, 'Failed to update payment status', 400);
        }
    },

    cancelOrder: async (req: Request, res: Response) => {
        try {
            const cancelled = await orderService.cancelOrder(req.params.id);
            if (!cancelled) {
                res.status(404).json({
                    success: false,
                    code: 404,
                    message: 'Order not found or cannot be cancelled',
                });
                return;
            }

            res.status(200).json({
                success: true,
                code: 200,
                message: 'Order cancelled successfully',
                data: cancelled,
            });
        } catch (error) {
            handleError(res, error, 'Failed to cancel order', 400);
        }
    },
};

export default controller;
