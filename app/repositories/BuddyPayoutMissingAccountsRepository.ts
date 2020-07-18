import IBuddyPayoutMissingAccount from '@app/interfaces/models/IBuddyPayoutMissingAccount';
import db from '@app/models';

export class BuddyPayoutMissingAccountsRepository {

    public create(buddyPayoutMissingAccount: IBuddyPayoutMissingAccount) {
        return db.BuddyPayoutMissingAccount.create(buddyPayoutMissingAccount);
    }

}
