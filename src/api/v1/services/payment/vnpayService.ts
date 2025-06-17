import crypto from 'crypto';
import qs from 'qs';
import moment from 'moment';
import { VnpayCreateUrlInput } from '../../types/payment/vnpayDTO';

const vnp_TmnCode = process.env.VNP_TMNCODE || '';
const vnp_HashSecret = process.env.VNP_HASH_SECRET || '';
const vnp_Url = process.env.VNP_URL || '';
const vnp_ReturnUrl = process.env.VNP_RETURN_URL || '';

export const createVnpayPaymentUrl = (
  userId: string,
  payload: VnpayCreateUrlInput
): string => {
  const date = new Date();
  const createDate = moment(date).format('YYYYMMDDHHmmss');
  const expireDate = moment(date).add(15, 'minutes').format('YYYYMMDDHHmmss');
  const orderId = `${Date.now()}`;
  let ipAddr = payload.ipAddr || '127.0.0.1';
  if (ipAddr === '::1') ipAddr = '127.0.0.1';
  const vnp_Params: Record<string, string> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderType: 'other',
    vnp_Amount: (payload.amount * 100).toString(),
    vnp_OrderInfo: encodeURIComponent(`Don hang ${orderId}`).replace(/%20/g, '+'),
    vnp_ReturnUrl: vnp_ReturnUrl,

    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
    vnp_ExpireDate: expireDate,
  };

  if (payload.bankCode) {
    vnp_Params['vnp_BankCode'] = payload.bankCode;
  }

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

export const verifyVnpayReturn = (query: any): boolean => {
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

function sortObject(obj: Record<string, any>) {
  const sorted: Record<string, any> = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}
