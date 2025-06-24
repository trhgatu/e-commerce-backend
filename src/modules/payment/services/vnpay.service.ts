import crypto from 'crypto';
import qs from 'qs';
import moment from 'moment';
import { VnpayCreateUrlInput, VNPAYQueryParams } from '../dtos/vnpay-input.dto';
import { PaymentStatus, OrderModel } from '@modules/order/models';
import { updatePaymentStatus } from '@modules/order/order.service';
import { logAction } from '@common/services/log.service';
import { LogAction } from '@common/models';

const vnp_TmnCode = process.env.VNP_TMNCODE || '';
const vnp_HashSecret = process.env.VNP_HASH_SECRET || '';
const vnp_Url = process.env.VNP_URL || '';
const vnp_ReturnUrl = process.env.VNP_RETURN_URL || '';

export const createVnpayPaymentUrl = async (
  userId: string,
  payload: VnpayCreateUrlInput
): Promise<string> => {
  const date = new Date();
  const { txnRef, bankCode, ipAddr } = payload;
  const order = await OrderModel.findOne({ txnRef }).lean();

  if (!order) {
    throw new Error('Order not found');
  }
  if (order.paymentStatus !== 'unpaid') {
    throw new Error('Order already paid or invalid status');
  }
  const amount = order.finalTotal;
  if (amount === undefined) {
    throw new Error('Order amount is undefined');
  }
  const vnp_TxnRef = txnRef;
  const createDate = moment(date).format('YYYYMMDDHHmmss');
  const expireDate = moment(date).add(15, 'minutes').format('YYYYMMDDHHmmss');
  let ip = ipAddr || '127.0.0.1';
  if (ip === '::1') ip = '127.0.0.1';
  const vnp_Params: Record<string, string> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: txnRef,
    vnp_OrderType: 'other',
    vnp_Amount: (amount * 100).toString(),
    vnp_OrderInfo: encodeURIComponent(`Don hang ${vnp_TxnRef}`).replace(/%20/g, '+'),
    vnp_ReturnUrl: vnp_ReturnUrl,
    vnp_IpAddr: ip,
    vnp_CreateDate: createDate,
    vnp_ExpireDate: expireDate,
  };

  if (bankCode) vnp_Params['vnp_BankCode'] = bankCode;


  const sortedParams = sortObject(vnp_Params);
  const signData = qs.stringify(sortedParams, { encode: true, format: 'RFC1738' });

  const hmac = crypto.createHmac('sha512', vnp_HashSecret.trim());
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  const signedParams: Record<string, string> = {
    ...sortedParams,
    vnp_SecureHash: signed,
    vnp_SecureHashType: 'SHA512',
  };

  const paymentUrl = `${vnp_Url}?${qs.stringify(signedParams, {
    encode: true,
    format: 'RFC1738',
  })}`;
  return paymentUrl;
};

export const verifyVnpayReturn = (query: VNPAYQueryParams): boolean => {
  const receivedSecureHash = query.vnp_SecureHash;
  delete query.vnp_SecureHash;
  delete query.vnp_SecureHashType;

  const rawParams = JSON.parse(JSON.stringify(query));
  const sortedParams = sortObject(rawParams);
  const signData = qs.stringify(sortedParams, {
    encode: true,
    format: 'RFC1738',
  });

  const hmac = crypto.createHmac('sha512', vnp_HashSecret.trim());
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  return receivedSecureHash === signed;
};


export const handleVnpayReturn = async (query: VNPAYQueryParams) => {
  const isValid = verifyVnpayReturn({ ...query });
  if (!isValid) throw new Error('Invalid VNPAY signature');

  const orderId = query['vnp_TxnRef'];
  const vnp_ResponseCode = query['vnp_ResponseCode'];

  const status = vnp_ResponseCode === '00' ? PaymentStatus.PAID : PaymentStatus.FAILED;

  const order = await OrderModel.findOne({ txnRef: orderId });
  if (!order) throw new Error('Order not found');

  await logAction({
    userId: 'vnpay-system',
    targetModel: 'Payment',
    targetId: String(order._id),
    action: LogAction.READ,
    description: `User returned from VNPAY with ${status.toUpperCase()} for txnRef ${orderId}`,
    metadata: query,
  });

  return {
    status: order.paymentStatus,
    orderId,
    message: order.paymentStatus === PaymentStatus.PAID
      ? 'Payment successful'
      : 'Waiting for confirmation',
  };
};


export const handleVnpayIpn = async (query: VNPAYQueryParams) => {
  const isValid = verifyVnpayReturn({ ...query });

  if (!isValid) throw new Error('Invalid VNPAY signature');

  const orderId = query['vnp_TxnRef'];
  const vnp_ResponseCode = query['vnp_ResponseCode'];

  const status = vnp_ResponseCode === '00' ? PaymentStatus.PAID : PaymentStatus.FAILED;

  const updatedOrder = await updatePaymentStatus(orderId, status, 'vnpay-ipn');
  if (!updatedOrder) throw new Error('Order not found or update failed');

  await logAction({
    userId: 'vnpay-ipn',
    targetModel: 'Payment',
    targetId: String(updatedOrder._id),
    action: LogAction.UPDATE,
    description: `VNPAY IPN returned ${status.toUpperCase()} for txnRef ${orderId}`,
    metadata: query,
  });

  return {
    status,
    orderId,
    message: status === PaymentStatus.PAID ? 'Payment successful (IPN)' : 'Payment failed (IPN)',
  };
};


function sortObject(obj: Record<string, string>): Record<string, string> {
  const sorted: Record<string, string> = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}
