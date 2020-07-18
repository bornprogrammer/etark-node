export interface IBuddyAccountTransaction {
    readonly id: number;
    userId: number;
    credit: number;
    debit: number;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export default IBuddyAccountTransaction;
