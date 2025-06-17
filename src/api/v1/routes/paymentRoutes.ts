import { Router } from 'express';
import controller from '../controllers/payment/vnpayController';
import { protect } from '../middlewares/authMiddleware';
import { createLog } from '../middlewares/logMiddleware';
import { LogAction } from '../models/logModel';

const router = Router();

//Payment with VNPAY
router.post('/vnpay/create-payment-url',
    protect,
    createLog(LogAction.UPDATE, 'Payment'),
    controller.createPaymentUrl
);
router.get('/vnpay/return', controller.handleReturnUrl);

//Payment with MOMO (coming)

export default router;
