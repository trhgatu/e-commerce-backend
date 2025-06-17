import { Router } from 'express';
import controller from '../controllers/payment/vnpayController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

//Payment with VNPAY
router.post('/vnpay/create-payment-url', protect, controller.createPaymentUrl);
router.get('/vnpay/return', controller.handleReturnUrl);

//Payment with MOMO (coming)

export default router;
