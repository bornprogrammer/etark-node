export interface IUserAccountOld {
    readonly id: number;
    user_id: number;
    month_year: string;
    total_amount_earned: number;
    total_service_charge: number;
    total_delivery_charge: number;
    pending_service_charge: number;
    total_gst_charge: number;
    pending_gst_charge: number;
    fb_total_amount: number;
    fb_pending_amount: number;
    fb_cleared_amount: number;
    paytm_amount: number;
    paytm_refund_amount: number;
    paid_service_charge: number;
    cleared_amount: number;
    paid_gst_charge: number;
    pk_payment_gateway_charges: number;
    pk_plan_charges: number;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export default IUserAccountOld;
