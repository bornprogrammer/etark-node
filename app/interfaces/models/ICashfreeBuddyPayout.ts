export interface ICashfreeBuddyPayout {
    readonly id?: number;
    userId: number;
    bankAccountId?: number;
    paytmAccountId?: number;
    credit: number;
    debit: number;
    amount: number;
    status: number;
    cashfreeTransferId: string;
    cashfreeReferenceId?: number;
    failureReason?: string;
    buddyAccountTransactionId?: number;
    accountTransactionId?: number;
    cronJobId: number;
    cashfreeBatchPayoutId?: number;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export default ICashfreeBuddyPayout;
