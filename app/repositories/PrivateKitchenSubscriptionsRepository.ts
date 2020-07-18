import db from '@app/models';

export class PrivateKitchenSubscriptionsRepository {

    public findAllByUserId = (userId) => {
        return db.PrivateKitchenSubscription.findAll({
            include : [
                {
                    model: db.PrivateKitchen,
                    required: true,
                    attributes: [],
                    where: {
                        createdBy: userId,
                    },
                },
                {
                    model: db.PrivateKitchenPlanHubPrice,
                    required: true,
                    attributes: ['effectivePricePerDay', 'discountedPrice'],
                    include: [
                        {
                            model: db.PrivateKitchenPlan,
                            required: true,
                            attributes: ['name'],
                        },
                    ],
                },
            ],
            order: [
                ['id', 'ASC'],
            ],
        });
    }

    public findLatestSubscriptionByPkId = (privateKitchenId) => {
        return db.PrivateKitchenSubscription.findOne({
            where: {
                privateKitchenId,
            },
            order: [
                ['id', 'DESC'],
            ],
        });
    }

}
