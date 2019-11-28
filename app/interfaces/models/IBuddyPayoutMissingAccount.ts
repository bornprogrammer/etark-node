export interface IBuddyPayoutMissingAccounts {
    readonly id?: number;
    userId: number;
    cronJobId: number;
    readonly createdAt?: string;
    readonly updatedAt?: string;
}

export default IBuddyPayoutMissingAccounts;
