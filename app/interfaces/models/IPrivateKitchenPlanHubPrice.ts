export interface IPrivateKitchenPlanHubPrice {
    readonly id: number;
    planId: number;
    foodyLimit: string;
    price: number;
    discountPercentage: number;
    discountRs: number;
    discountedPrice: number;
    effectivePricePerDay: number;
    isDiscounted: number;
    hubId: number;
    upgradeText: string;
    isBestDeal: number;
    isActive: number;
    planExpiryDate: string;
    hikedPkPlanHubPricesId: number;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export default IPrivateKitchenPlanHubPrice;
