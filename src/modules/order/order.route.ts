// src/routes/orderRoutes.ts
import { Router } from 'express';
import controller from './order.controller';
import { createOrderSchema, updateOrderStatusSchema } from './order.validator';
import { protect, createLog, validate } from '@middlewares';
import { LogAction } from '@common/models';

const router = Router();

router.get('/', controller.getAllOrders);

router.post(
  '/create',
  protect,
  validate(createOrderSchema),
  createLog(LogAction.CREATE, 'Order'),
  controller.createOrder
);

router.get('/mine', controller.getMyOrders);

router.get('/:id', controller.getOrderById);

router.put(
  '/status/:id',
  protect,
  validate(updateOrderStatusSchema),
  createLog(LogAction.UPDATE, 'Order'),
  controller.updateOrderStatus
);

router.put(
  '/payment/:id',
  protect,
  createLog(LogAction.UPDATE, 'Order'),
  controller.updatePaymentStatus
);

router.post('/checkout', protect, controller.checkoutFromCart);

router.put('/cancel/:id', controller.cancelOrder);

export default router;
