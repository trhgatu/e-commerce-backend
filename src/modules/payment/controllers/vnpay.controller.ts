import { Request, Response } from 'express';
import {
  createVnpayPaymentUrl,
  handleVnpayReturn,
  handleVnpayIpn,
} from '../services/vnpay.service';
import { VnpayCreateUrlInput } from '../dtos/vnpay-input.dto';
import { handleError } from '@common/utils';
import { VNPAYQueryParams } from '../dtos/vnpay-input.dto';

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
      const query = req.query as VNPAYQueryParams;
      const result = await handleVnpayReturn(query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      handleError(res, error, 'Failed to verify VNPAY return URL', 400);
    }
  },

  handleIpnUrl: async (req: Request, res: Response) => {
    try {
      const query = req.query as VNPAYQueryParams;
      await handleVnpayIpn(query);
      res.status(200).send('IPN received');
    } catch (error) {
      console.error('[VNPAY IPN error]', error);
      res.status(400).send('IPN failed');
    }
  },
};

export default vnpayController;
