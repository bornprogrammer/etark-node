export default class BuddyPayoutCronJobConstants {

    public static readonly STATUS = {
        UNPROCESSED: 0, // when row is created - default value
        INITIATED: 1,   // when the api calls to transfer amount has been made
        PROCESSED: 2,   // when the status of all transactions is fetched from cashfree and updated
    };
}
