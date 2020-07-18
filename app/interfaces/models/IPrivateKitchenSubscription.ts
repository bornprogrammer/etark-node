export interface IPrivateKitchenSubscription {
    readonly id: number;
    privateKitchenId: number;
    privateKitchenPlanPriceId: string;
    startAction: number;
    endAction: number;
    privateKitchenPlanId: number;
    startDate: number;
    endDate: number;
    status: number;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export default IPrivateKitchenSubscription;
