export default interface ICartItem {
    readonly id: number;
    cartId: number;
    itemId: number;
    orderedUnit: number;
    unitPrice: number;
    subTotal: number;
    discount: number;
    netCost: number;
    itemLookupId: number;
    deliveryStart: Date;
    deliveryEnd: Date;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}
