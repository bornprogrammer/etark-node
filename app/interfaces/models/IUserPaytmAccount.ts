export interface IUserPaytmAccount {
    readonly id: number;
    userId: number;
    phone: string;
    cashfreeBeneficiaryId: string;
    readonly createdAt?: string;
    readonly updatedAt?: string;
    readonly deletedAt?: string;
}

export default IUserPaytmAccount;
