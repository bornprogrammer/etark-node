export interface IDish {
    readonly id: number;
    userId: number;
    transactionType: 'CREDIT' | 'DEBIT';
    origin: 'account_transaction' | 'buddy_account_transactions';
    originId: number;
    description: string;
    amount: number;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export default IDish;
