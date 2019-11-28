export default interface ICart  {
    readonly id: number;
    cartValue: number;
    userId: number;
    discount: number;
    isEnable: boolean;
    grandTotal: number;
    readonly createdAt?: string;
    readonly updatedAt?: string;

}
