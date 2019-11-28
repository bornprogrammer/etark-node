export interface IUserBankAccount {
    readonly id: number;
    userId: number;
    accountNumber: string;
    ifsc: string;
    accountHolderName: string;
    validationStatus: string;
    readonly createdAt?: string;
    readonly updatedAt?: string;
    readonly deletedAt?: string;
}

export default IUserBankAccount;
