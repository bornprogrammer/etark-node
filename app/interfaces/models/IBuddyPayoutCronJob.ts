export interface IBuddyPayoutCronJob {
    readonly id?: number;
    totalEligibleTransfers?: number;
    usersWithoutPaymentDetails?: number;
    totalBankTransfers?: number;
    totalPaytmTransfers?: number;
    successfullBankTransfers?: number;
    unsuccessfullBankTransfers?: number;
    successfullPaytmTransfers?: number;
    unsuccessfullPaytmTransfers?: number;
    status: number;
    processedAt?: string;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export default IBuddyPayoutCronJob;
