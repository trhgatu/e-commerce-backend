// src/routes/orderRoutes.ts
import { Router } from 'express';
import orderController from '../controllers/orderController';
import { validate } from '../middlewares/validateMiddleware';
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from '../validators/orderValidator';

const router = Router();

router.post('/create', validate(createOrderSchema), orderController.createOrder);

router.get('/mine', orderController.getMyOrders);

router.get('/:id', orderController.getOrderById);

router.get('/', orderController.getAllOrders);

router.put('/status/:id', validate(updateOrderStatusSchema), orderController.updateOrderStatus);

router.put('/payment/:id', orderController.updatePaymentStatus);

router.delete('/delete/:id', orderController.deleteOrder);

export default router;
