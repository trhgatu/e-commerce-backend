// src/routes/orderRoutes.ts
import { Router } from 'express';
import orderController from '../controllers/orderController';
import { validate } from '../middlewares/validateMiddleware';
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from '../validators/orderValidator';
import { protect } from '../middlewares/authMiddleware';
import { createLog } from '../middlewares/logMiddleware';
import { LogAction } from '../models/logModel';


const router = Router();

router.post('/create',
  protect,
  validate(createOrderSchema),
  createLog(LogAction.CREATE, 'Order'),
  orderController.createOrder
);

router.get('/mine', orderController.getMyOrders);

router.get('/:id', orderController.getOrderById);

router.put('/status/:id', validate(updateOrderStatusSchema), orderController.updateOrderStatus);

router.put('/payment/:id', orderController.updatePaymentStatus);

router.put('/cancel/:id', orderController.cancelOrder);

export default router;
