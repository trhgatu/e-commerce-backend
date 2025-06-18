import { Request, Response } from 'express';
import * as orderService from './order.service';
import * as cartService from '@modules/cart/cart.service'
import { handleError, buildCommonQuery } from '@common/utils';
import { checkoutCartToOrder } from '@usecases/checkout-cart-to-order.usecase';

const controller = {
    getAllOrders: async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const { filters, sort } = buildCommonQuery(req, ["name", "description"]);
            const result = await orderService.getAllOrders(
                page,
                limit,
                filters,
                sort,
            );

            res.status(200).json({
                success: true,
                code: 200,
                message: 'Orders fetched successfully',
                data: result.data,
                currentPage: result.currentPage,
                totalPages: result.totalPages,
                totalItems: result.total,
            });
        } catch (error) {
            handleError(res, error, 'Failed to fetch products', 400);
        }
    },
    checkoutFromCart: async (req: Request, res: Response) => {
        try {
            const userId = req.user?._id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const { shippingInfo, paymentMethod, voucherCode } = req.body;

            if (!shippingInfo || !paymentMethod) {
                res.status(400).json({ message: 'Missing shipping or payment method' });
                return;
            }

            const orderInput = await checkoutCartToOrder(
                userId,
                paymentMethod,
                shippingInfo,
                voucherCode
            );

            const order = await orderService.createOrder(orderInput, userId);
            await cartService.clearCart(userId);

            res.status(201).json({ success: true, data: order });
        } catch (error) {
            handleError(res, error, 'Failed to check out from cart', 400);
        }
    },
    createOrder: async (req: Request, res: Response) => {
        try {
            const userId = req.user?._id;
            if (!userId) throw new Error('User not authenticated');

            const { items, shippingInfo, paymentMethod, voucherCode } = req.body;

            const order = await orderService.createOrder(
                {
                    items,
                    shippingInfo,
                    paymentMethod,
                    voucherCode,
                },
                userId
            );
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
            const userId = req.user?._id;
            if (!userId) throw new Error('User not authenticated');
            const { status } = req.body;
            const order = await orderService.updateOrderStatus(req.params.id, status, userId);

            if (!order) {
                res.status(404).json({
                    success: false,
                    code: 404,
                    message: 'Order not found or status not changed',
                });
                return;
            }
            res.locals.targetId = order._id?.toString();
            res.locals.description = `Updated order status to: ${order.status}`;

            res.status(200).json({
                success: true,
                code: 200,
                message: 'Order status updated successfully',
                data: order,
            });
        } catch (error) {
            handleError(res, error, 'Failed to update order status', 400);
        }
    },

    updatePaymentStatus: async (req: Request, res: Response) => {
        try {
            const userId = req.user?._id;
            if (!userId) throw new Error('User not authenticated');
            const { paymentStatus } = req.body;
            const order = await orderService.updatePaymentStatus(req.params.id, paymentStatus, userId);

            if (!order) {
                res.status(404).json({
                    success: false,
                    code: 404,
                    message: 'Order not found or payment status not changed',
                });
                return;
            }
            res.locals.targetId = order._id?.toString();
            res.locals.description = `Updated payment status to: ${order.paymentStatus}`;
            res.status(200).json({
                success: true,
                code: 200,
                message: 'Payment status updated successfully',
                data: order,
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
