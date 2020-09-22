
export interface PaytmRefundParamsEntity {
    orderId: string;
    txnId: string;
    refundId: string;
    amount: number;
    complain_id?: number;
}