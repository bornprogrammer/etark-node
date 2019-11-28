import db from '@app/models';

export class BuddyWalletRepository {

    public create = (attrs: any) => {
        return db.BuddyWallet.create(attrs);
    }

    public findDebitTransctions = () => {
        return db.BuddyWallet.findAll({
            where: {
                origin: 'account_transaction',
            },
            raw: true,
        });
    }

}
