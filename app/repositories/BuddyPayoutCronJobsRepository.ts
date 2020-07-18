import BuddyPayoutCronJobConstants from '@app/constants/BuddyPayoutCronJobConstants';
import db from '@app/models';

export class BuddyPayoutCronJobsRepository {

    public create(buddyPayoutCronJob) {
        return db.BuddyPayoutCronJob.create(buddyPayoutCronJob);
    }

    public findInitiated = () => {
        return db.BuddyPayoutCronJob.findAll({
            include: [
                { all: true },
                {
                    model: db.CashfreeBatchPayout,
                    required: true,
                    include: [
                        { all: true },
                        {
                            model: db.CashfreeBuddyPayout,
                            required: true,
                        },
                    ],
                },
            ],
            where: {
                status: BuddyPayoutCronJobConstants.STATUS.INITIATED,
            },
        });
    }

    public findLast2 = () => {
        return db.BuddyPayoutCronJob.findAll({
            include: [
                { all: true },
                {
                    model: db.CashfreeBatchPayout,
                    required: true,
                    include: [
                        { all: true },
                        {
                            model: db.CashfreeBuddyPayout,
                            required: true,
                        },
                    ],
                },
            ],
            order: [
                ['id', 'DESC'],
            ],
            limit: 2,
        });
    }

}
