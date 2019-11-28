export interface IOrder {
    readonly id: number;
    cartId: number;
    status: string;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export default IOrder;
