export interface IPrivateKitchenPlan {
    readonly id: number;
    name: string;
    description: string;
    isDeleted: boolean;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export default IPrivateKitchenPlan;
