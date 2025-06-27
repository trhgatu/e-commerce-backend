import { Router } from 'express';
import controller from '../controllers/vnpay.controller';
import { protect, createLog } from '@middlewares';
import { LogAction } from '@common/models';

const router = Router();

//Payment with VNPAY
router.post(
  '/vnpay/create-payment-url',
  protect,
  createLog(LogAction.UPDATE, 'Payment'),
  controller.createPaymentUrl
);
router.get('/vnpay/return', controller.handleReturnUrl);

router.get('/payment/vnpay-ipn', controller.handleIpnUrl);
//Payment with MOMO (coming)

export default router;
