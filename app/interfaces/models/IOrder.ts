export interface IOrder {
    readonly id: number;
    foodyId: number;
    addressType: string;
    addressId: number;
    hubId: number;
    dishId: number;
    postedDishId: number;
    deviceId: number;
    orderedUnits: number;
    totalCost: number;
    totalServiceCharge: number;
    deliveryStartTime: number;
    deliveryCharge: number;
    netAmount: number;
    suggestion: string;
    orderStatus: string;
    paymentType: string;
    refundStatus: string;
    respondedAt: string;
    completedAt: string;
    deliveryTime: string;
    deliveryChargeId: number;
    gstCharge: number;
    isRequest: number;
    walletAmount: number;
    isSchedular: number;
    promotionsWalletAmount: number;
    regularWalletAmount: number;
    orderStatusUpdatedAt: string;
    noteFromChef: string;
    privateKitchenHubId: number;
    onlineTransactionCharges: number;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export default IOrder;
