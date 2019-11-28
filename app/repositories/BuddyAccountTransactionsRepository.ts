import db from '@app/models';
import Logger from '@app/services/Logger';

export class BuddyAccountTransactionsRepository {

    public create(attrs) {
        return db.BuddyAccountTransaction.create(attrs);
    }

    public bulkCreate(rows) {
        return db.BuddyAccountTransaction.bulkCreate(rows);
    }

    public findTotalDebitCreditForAllUsers = () => {
        return db.BuddyAccountTransaction.findAll({
            group: ['user_id'],
            attributes: [
                [db.sequelize.fn('sum', db.sequelize.col('credit')), 'credit'],
                [db.sequelize.fn('sum', db.sequelize.col('debit')), 'debit'],
                'userId',
            ],
        });
    }

    public deleteByAttributes = (attributes) => {
        return db.BuddyAccountTransaction.destroy({
            where: attributes,
        });
    }

}
