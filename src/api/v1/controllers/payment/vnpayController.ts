import { Request, Response } from 'express';
import { createVnpayPaymentUrl, verifyVnpayReturn } from '../../services/payment/vnpayService';
import { VnpayCreateUrlInput } from '../../types/payment/vnpayDTO';
import { handleError } from '../../utils';
import qs from 'qs';

const vnpayController = {
  createPaymentUrl: async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      if (!userId) throw new Error('Unauthorized');

      const { amount, bankCode } = req.body;
      if (!amount || amount <= 0) throw new Error('Invalid amount');

      const input: VnpayCreateUrlInput = {
        amount,
        bankCode,
        ipAddr: req.ip,
      };

      const paymentUrl = await createVnpayPaymentUrl(userId, input);
      res.status(200).json({ success: true, url: paymentUrl });
    } catch (error) {
      console.error('[VNPAY create error]', error);
      handleError(res, error, 'Failed to create VNPAY payment URL', 400);
    }
  },

  handleReturnUrl: async (req: Request, res: Response) => {
    try {
      console.log('[RETURN PARAMS]', req.query);
      const parsedParams = req.query;
      const isValid = verifyVnpayReturn(parsedParams);
      if (!isValid) throw new Error('Invalid VNPAY signature');

      const vnp_ResponseCode = parsedParams['vnp_ResponseCode'];
      const transactionStatus = vnp_ResponseCode === '00' ? 'SUCCESS' : 'FAILED';

      res.status(200).json({
        success: true,
        status: transactionStatus,
        orderId: parsedParams['vnp_TxnRef'],
        message: transactionStatus === 'SUCCESS' ? 'Payment successful' : 'Payment failed',
      });
    } catch (error) {
      console.error('[VNPAY return error]', error);
      handleError(res, error, 'Failed to verify VNPAY return URL', 400);
    }
  },
};

export default vnpayController;
