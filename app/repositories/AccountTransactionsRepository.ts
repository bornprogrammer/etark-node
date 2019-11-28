import db from '@app/models';

export class AccountTransactionsRepository {

    public create = (attrs: any) => {
        return db.AccountTransaction.create(attrs);
    }

    public findTotalDebitCreditForAllUsers = () => {
        return db.AccountTransaction.findAll({
            include : [
                {
                    model: db.UserAccountOld,
                    required: true,
                    attributes: ['user_id'],
                },
            ],
            group: ['userAccountOld.user_id'],
            attributes: [
                [db.sequelize.fn('sum', db.sequelize.col('credit')), 'credit'],
                [db.sequelize.fn('sum', db.sequelize.col('debit')), 'debit'],
            ],
        });
    }

    public findMaxId = () => {
        return db.AccountTransaction.max('id');
    }

    public fetchRecordsInIdRange = (startId: number, endId: number) => {
        return db.AccountTransaction.findAll({
            include : [
                {
                    model: db.UserAccountOld,
                    required: true,
                    attributes: ['user_id'],
                },
            ],
            where: {
                id: {
                    [db.Sequelize.Op.between]: [startId, endId],
                },
            },
            attributes: [
                'credit', 'debit', 'id',
            ],
            raw: true,
        });
    }

    public findDebitTransctions = () => {
        return db.AccountTransaction.findAll({
            where: {
                origin: 'account_transaction',
            },
            raw: true,
        });
    }

    public deleteByAttributes = (attributes) => {
        return db.AccountTransaction.destroy({
            where: attributes,
        });
    }

}
