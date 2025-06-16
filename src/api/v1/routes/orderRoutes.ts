// src/routes/orderRoutes.ts
import { Router } from 'express';
import controller from '../controllers/orderController';
import { validate } from '../middlewares/validateMiddleware';
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from '../validators/orderValidator';
import { protect } from '../middlewares/authMiddleware';
import { createLog } from '../middlewares/logMiddleware';
import { LogAction } from '../models/logModel';


const router = Router();

router.get('/', controller.getAllOrders)

router.post('/create',
  protect,
  validate(createOrderSchema),
  createLog(LogAction.CREATE, 'Order'),
  controller.createOrder
);

router.get('/mine', controller.getMyOrders);

router.get('/:id', controller.getOrderById);

router.put('/status/:id',
  protect,
  validate(updateOrderStatusSchema),
  createLog(LogAction.UPDATE, 'Order'),
  controller.updateOrderStatus
);

router.put('/payment/:id',
  protect,
  createLog(LogAction.UPDATE, 'Order'),
  controller.updatePaymentStatus
);

router.put('/cancel/:id', controller.cancelOrder);

export default router;
