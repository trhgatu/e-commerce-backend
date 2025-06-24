export interface VnpayCreateUrlInput {
  txnRef: string;
  bankCode?: string;
  ipAddr?: string;
}

export interface VNPAYQueryParams {
  vnp_TxnRef: string;
  vnp_ResponseCode: string;
  vnp_SecureHash?: string;
  vnp_SecureHashType?: string;
  [key: string]: string | undefined;
}