export interface IPrivateKitchen {
    readonly id: number;
    name: number;
    createdBy: number;
    securityLevel: number;
    type: number;
    status: string;
    hubId: number;
    isDeleted: number;
    isActive: number;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export default IPrivateKitchen;
