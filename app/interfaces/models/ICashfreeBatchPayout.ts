export interface IBuddyPayoutCronJob {
    readonly id: number;
    batchTransferId: string;
    referenceId: number;
    totalTransactionsCount: number;
    successfullTransactionsCount: number;
    failedTransactionsCount: number;
    cronJobId: number;
    status: number;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export default IBuddyPayoutCronJob;
