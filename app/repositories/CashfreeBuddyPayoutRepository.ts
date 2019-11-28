import CashfreeBuddyPayoutConstants from '@app/constants/CashfreeBuddyPayoutConstants';
import ICashfreeBuddyPayout from '@app/interfaces/models/ICashfreeBuddyPayout';
import db from '@app/models';

export class CashfreeBuddyPayoutRepository {

    public create = (cashfreeBuddyPayout: ICashfreeBuddyPayout) => {
        return db.CashfreeBuddyPayout.create(cashfreeBuddyPayout);
    }

    public findAllBankTransfersByCronJobId = (cronJobId, idGreaterThan, limit): any => {
        return db.CashfreeBuddyPayout.findAll({
            include : [
                {
                    model: db.UserBankAccount,
                    required: true,
                },
                {
                    model: db.User,
                    required: true,
                    attributes: ['name', 'emailId', 'phone'],
                },
            ],
            where: {
                cronJobId,
                id: {
                    [db.Sequelize.Op.gt]: idGreaterThan,
                },
                bankAccountId: {
                    [db.Sequelize.Op.ne]: null,
                },
            },
            limit,
            order: [
                ['id', 'ASC'],
            ],
        });
    }

    public findAllPaytmTransfersByCronJobId = (cronJobId, idGreaterThan, limit, status = null): any => {

        const whereClause: any = {
            cronJobId,
            id: { [db.Sequelize.Op.gt]: idGreaterThan },
            paytmAccountId: { [db.Sequelize.Op.ne]: null },
        };

        if (status) {
            whereClause.status = status;
        }

        return db.CashfreeBuddyPayout.findAll({
            include : [
                {
                    model: db.UserPaytmAccount,
                    required: true,
                },
                {
                    model: db.User,
                    required: true,
                    attributes: ['name', 'emailId'],
                },
            ],
            where: whereClause,
            limit,
            order: [
                ['id', 'ASC'],
            ],
        });
    }

    public updateCashfreeBatchPayoutIds = (ids: number[], cashfreeBatchPayoutId): any => {
        return db.CashfreeBuddyPayout.update({
                cashfreeBatchPayoutId,
            }, {
                where: {
                    id: ids,
                },
        });
    }

    public findSuccessfullBankTransfersCount = (cronJobId) => {
        return db.CashfreeBuddyPayout.count({
            where: {
                cronJobId,
                status: CashfreeBuddyPayoutConstants.STATUS.SUCCESSFUL,
                bankAccountId: {
                    [db.Sequelize.Op.ne]: null,
                },
            },
        });
    }

    public findUnsuccessfullBankTransfersCount = (cronJobId) => {
        return db.CashfreeBuddyPayout.count({
            where: {
                cronJobId,
                status: {
                    [db.Sequelize.Op.ne]: CashfreeBuddyPayoutConstants.STATUS.SUCCESSFUL,
                },
                bankAccountId: {
                    [db.Sequelize.Op.ne]: null,
                },
            },
        });
    }

    public findSuccessfullPaytmTransfersCount = (cronJobId) => {
        return db.CashfreeBuddyPayout.count({
            where: {
                cronJobId,
                status: CashfreeBuddyPayoutConstants.STATUS.SUCCESSFUL,
                bankAccountId: null,
            },
        });
    }

    public findUnsuccessfullPaytmTransfersCount = (cronJobId) => {
        return db.CashfreeBuddyPayout.count({
            where: {
                cronJobId,
                status: {
                    [db.Sequelize.Op.ne]: CashfreeBuddyPayoutConstants.STATUS.SUCCESSFUL,
                },
                bankAccountId: null,
            },
        });
    }

    public findNonAccountedSuccessTransfersByCronJobId = (cronJobId, idGreaterThan, limit) => {
        return db.CashfreeBuddyPayout.findAll({
            where: {
                cronJobId,
                id: {
                    [db.Sequelize.Op.gt]: idGreaterThan,
                },
                status: CashfreeBuddyPayoutConstants.STATUS.SUCCESSFUL,
                [db.Sequelize.Op.or] : {
                    buddyAccountTransactionId: null,
                    accountTransactionId: null,
                },
            },
            limit,
            order: [
                ['id', 'ASC'],
            ],
        });
    }

    public findFailedTransfersByCronJobId = (cronJobId, idGreaterThan, limit) => {
        return db.CashfreeBuddyPayout.findAll({
            where: {
                cronJobId,
                id: {
                    [db.Sequelize.Op.gt]: idGreaterThan,
                },
                status: [
                    CashfreeBuddyPayoutConstants.STATUS.ERROR,
                    CashfreeBuddyPayoutConstants.STATUS.FAILED,
                    CashfreeBuddyPayoutConstants.STATUS.REVERSED,
                ],
            },
            limit,
            order: [
                ['id', 'ASC'],
            ],
        });
    }

    public findByAttributes = (attributes) => {
        return db.CashfreeBuddyPayout.findOne({
            where: attributes,
        });
    }

}
