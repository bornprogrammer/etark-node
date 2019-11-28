export interface IAccountTransaction {
    readonly id: number;
    accountId: number;
    credit: number;
    debit: number;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export default IAccountTransaction;
