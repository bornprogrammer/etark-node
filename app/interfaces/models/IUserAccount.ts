export interface IUserAccount {
    readonly id: number;
    userId: number;
    overallEarnedAmount: number;
    incurredPkPlanCharge: number;
    incurredPkGatewayCharge: number;
    incurredServiceCharge: number;
    incurredOverallCharge: number;
    paidOverallCharge: number;
    pendingOverallCharge: number;
    onlineOrdersAmount: number;
    receivedOnlineOrdersAmount: number;
    pendingOnlineOrdersAmount: number;
    savedServiceCharge: number;
    pkOnlineOrdersAmount: number;
    pkOnlineOrdersCount: number;
    pkPlans: any;
    paidOverAllByCredits: number;
    paidOverAllRegular: number;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export default IUserAccount;
