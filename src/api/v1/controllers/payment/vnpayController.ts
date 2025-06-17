import { Request, Response } from 'express';
import { createVnpayPaymentUrl, handleVnpayReturn } from '../../services/payment/vnpayService';
import { VnpayCreateUrlInput } from '../../types/payment/vnpayDTO';
import { handleError } from '../../utils';

const vnpayController = {
  createPaymentUrl: async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      if (!userId) throw new Error('Unauthorized');
      const { bankCode, orderId } = req.body;

      const input: VnpayCreateUrlInput = {
        txnRef: orderId,
        bankCode,
        ipAddr: req.ip,
      };
      res.locals.targetId = orderId;
      res.locals.description = `Requested VNPAY payment for order ${orderId}`;
      const paymentUrl = await createVnpayPaymentUrl(userId, input);
      res.status(200).json({ success: true, url: paymentUrl });
    } catch (error) {
      console.error('[VNPAY create error]', error);
      handleError(res, error, 'Failed to create VNPAY payment URL', 400);
    }
  },

  handleReturnUrl: async (req: Request, res: Response) => {
    try {
      const result = await handleVnpayReturn(req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      handleError(res, error, 'Failed to verify VNPAY return URL', 400);
    }
  },
};

export default vnpayController;
