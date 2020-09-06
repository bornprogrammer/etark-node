
export interface AfterAddingAddressEventEmitterEntity {
    serviceCenterId: number;
    userPlanId: number;
    deliveryAmount: number;
    distance: number;
    userAddressId?: number;
    status?: string;
}