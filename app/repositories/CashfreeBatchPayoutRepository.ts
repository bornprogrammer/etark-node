import db from '@app/models';

export class CashfreeBatchPayoutRepository {

    public create = (attrs) => {
        return db.CashfreeBatchPayout.create(attrs);
    }

    public findAllByCronJobId = (cronJobId) => {
        return db.CashfreeBatchPayout.findAll({
            where: {
                cronJobId,
            },
        });
    }

}
