// src/controllers/orderController.ts
import { Request, Response } from 'express';
import * as orderService from '../services/orderService';
import { handleError } from '../utils/handleError';

const controller = {
    createOrder: async (req: Request, res: Response) => {
        try {
            const orderData = req.body;
            const order = await orderService.createOrder(orderData);

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

    getAllOrders: async (_req: Request, res: Response) => {
        try {
            const orders = await orderService.getAllOrders();
            res.status(200).json({
                success: true,
                code: 200,
                message: 'All orders fetched',
                data: orders,
            });
        } catch (error) {
            handleError(res, error, 'Failed to fetch orders', 400);
        }
    },

    getMyOrders: async (req: Request, res: Response) => {
        try {
            const userId = req.user?._id;
            if (!userId) {
                res.status(400).json({
                    success: false,
                    code: 400,
                    message: 'User ID is required',
                });
                return;
            }
            const orders = await orderService.getOrdersByUserId(userId);
            res.status(200).json({
                success: true,
                code: 200,
                message: 'User orders fetched',
                data: orders,
            });
        } catch (error) {
            handleError(res, error, 'Failed to fetch user orders', 400);
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

    updateOrderStatus: async (req: Request, res: Response) => {
        try {
            const { status } = req.body;
            const updated = await orderService.updateOrderStatus(req.params.id, status);

            if (!updated) {
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
                message: 'Order status updated',
                data: updated,
            });
        } catch (error) {
            handleError(res, error, 'Failed to update status', 400);
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
                    message: 'Order not found',
                });
                return;
            }

            res.status(200).json({
                success: true,
                code: 200,
                message: 'Payment status updated',
                data: updated,
            });
        } catch (error) {
            handleError(res, error, 'Failed to update payment status', 400);
        }
    },

    deleteOrder: async (req: Request, res: Response) => {
        try {
            const deleted = await orderService.deleteOrder(req.params.id);

            if (!deleted) {
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
                message: 'Order deleted',
            });
        } catch (error) {
            handleError(res, error, 'Failed to delete order', 400);
        }
    },
};

export default controller;
