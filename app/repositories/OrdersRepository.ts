import OrderConstants from '@app/constants/OrderConstants';
import db from '@app/models';

export class OrdersRepository {

    public findAllOrdersbyBuddyMonthYear = (buddyId, month, year) => {
        const Op = db.Sequelize.Op;
        return db.Order.findAll({
            include : [
                {
                    model: db.Dish,
                    required: true,
                    attributes: ['name'],
                    where: {
                        buddyId,
                    },
                },
                {
                    model: db.User,
                    required: true,
                    attributes: ['name'],
                },
            ],
            where: {
                [Op.and]: [
                    db.sequelize.where(db.sequelize.fn('YEAR', db.sequelize.col('orders.created_at')), year),
                    db.sequelize.where(db.sequelize.fn('MONTH', db.sequelize.col('orders.created_at')), month),
                    {
                        orderStatus: {
                            [Op.in] : ['completed', 'confirmed', 'request_confirmed'],
                        },
                        deliveryTime: {
                            [Op.lt] : db.sequelize.fn('UTC_TIMESTAMP'),
                        },
                    },
                ],
            },
            order: [
                ['id', 'ASC'],
            ],
            attributes: ['id', 'netAmount', 'totalServiceCharge', 'onlineTransactionCharges'],
        });
    }

    public findOnlinePkOrdersbyBuddyMonthYear = (buddyId, month, year) => {
        const Op = db.Sequelize.Op;
        return db.Order.findAll({
            include : [
                {
                    model: db.Dish,
                    required: true,
                    attributes: ['name'],
                    where: {
                        buddyId,
                    },
                },
                {
                    model: db.User,
                    required: true,
                    attributes: ['name'],
                },
            ],
            where: {
                [Op.and]: [
                    db.sequelize.where(db.sequelize.fn('YEAR', db.sequelize.col('orders.created_at')), year),
                    db.sequelize.where(db.sequelize.fn('MONTH', db.sequelize.col('orders.created_at')), month),
                    {
                        onlineTransactionCharges: {
                            [Op.gt]: 0,
                            [Op.ne]: null,
                        },
                        orderStatus: {
                            [Op.in] : ['completed', 'confirmed', 'request_confirmed'],
                        },
                        deliveryTime: {
                            [Op.lt] : db.sequelize.fn('UTC_TIMESTAMP'),
                        },
                    },
                ],
            },
            attributes: ['id', 'netAmount', 'totalServiceCharge', 'onlineTransactionCharges'],
            order: [
                ['id', 'ASC'],
            ],
        });
    }

    public findAllOnlineOrdersbyBuddyMonthYear = (buddyId, month, year) => {
        const Op = db.Sequelize.Op;
        return db.Order.findAll({
            include : [
                {
                    model: db.Dish,
                    required: true,
                    attributes: ['name'],
                    where: {
                        buddyId,
                    },
                },
                {
                    model: db.User,
                    required: true,
                    attributes: ['name'],
                },
            ],
            where: {
                [Op.and]: [
                    db.sequelize.where(db.sequelize.fn('YEAR', db.sequelize.col('orders.created_at')), year),
                    db.sequelize.where(db.sequelize.fn('MONTH', db.sequelize.col('orders.created_at')), month),
                    {
                        paymentType: {
                            [Op.ne] : OrderConstants.PAYMENT_TYPES.CASH_ON_DLY,
                        },
                        orderStatus: {
                            [Op.in] : ['completed', 'confirmed', 'request_confirmed'],
                        },
                        deliveryTime: {
                            [Op.lt] : db.sequelize.fn('UTC_TIMESTAMP'),
                        },
                    },
                ],
            },
            attributes: ['id', 'netAmount', 'onlineTransactionCharges', 'totalServiceCharge'],
            order: [
                ['id', 'ASC'],
            ],
        });
    }

    public queryUserAccountAttrs = () => {
        return db.sequelize.query(`SELECT overallEarnedAmount.buddy_id as buddyId,
                overallEarnedAmount.overallEarnedAmount,
                overallEarnedAmount.incurredServiceCharge,
                incurredPkGatewayCharge.incurredPkGatewayCharge,
                incurredPkGatewayCharge.pkOnlineOrdersCount,
                incurredPkGatewayCharge.pkOnlineOrdersAmount,
                onlineOrdersAmount.onlineOrdersAmount,
                savedServiceCharge.savedServiceCharge,
                paidOverAllByCredits.paidOverAllByCredits,
                creditDebit.receivedOnlineOrdersAmount,
                creditDebit.paidOverallCharge
                FROM (
                    SELECT SUM(o.net_amount) as overallEarnedAmount,
                    SUM(o.total_service_charge) as incurredServiceCharge,
                    d.buddy_id from orders as o
                    INNER JOIN dishes AS d ON d.id = o.dish_id
                    WHERE o.order_status IN ('completed', 'request_confirmed', 'confirmed')
                    AND o.delivery_time < UTC_TIMESTAMP()
                    GROUP BY d.buddy_id
            ) as overallEarnedAmount
            LEFT JOIN
            (
                SELECT SUM(online_transaction_charges) as incurredPkGatewayCharge,
                        count(o.id) as pkOnlineOrdersCount,
                        SUM(net_amount) AS pkOnlineOrdersAmount, d.buddy_id from orders as o
                    INNER JOIN dishes as d on d.id = o.dish_id
                    WHERE o.private_kitchen_hub_id != 0
                        AND o.private_kitchen_hub_id IS NOT NULL
                        AND o.payment_type != 'CASH_ON_DLY'
                        AND o.order_status IN ('completed', 'request_confirmed', 'confirmed')
                        AND o.delivery_time < UTC_TIMESTAMP()
                    GROUP BY d.buddy_id
            ) as incurredPkGatewayCharge on incurredPkGatewayCharge.buddy_id = overallEarnedAmount.buddy_id
            LEFT JOIN (
                SELECT SUM(
                            IF
                                (
                                    o.payment_type in (
                                                'PAYTM', 'CASHFREE', 'WALLET', 'WALLET_AND_CASHFREE',
                                                'WALLET_AND_PAYTM'
                                ) || h.type = 'office',
                                o.net_amount, o.wallet_amount
                            )
                        )
                    as onlineOrdersAmount,
                    d.buddy_id from orders as o
                INNER JOIN dishes AS d ON d.id = o.dish_id
                INNER JOIN hub AS h ON h.id = o.hub_id
                WHERE o.order_status IN ('completed', 'request_confirmed', 'confirmed')
                AND o.delivery_time < UTC_TIMESTAMP()
                GROUP BY d.buddy_id
            ) AS onlineOrdersAmount on onlineOrdersAmount.buddy_id = overallEarnedAmount.buddy_id
            LEFT JOIN (
                SELECT SUM(
                    if (
                        (( CEIL(((net_amount - o.delivery_charge)/ordered_units)/50) - 1) * 5 * ordered_units) >
                            5 * ordered_units,
                        (( CEIL(((net_amount - o.delivery_charge)/ordered_units)/50) - 1) * 5 * ordered_units),
                        5 * ordered_units
                    )
                ) as savedServiceCharge,
                d.buddy_id from orders as o
                    INNER JOIN dishes as d on d.id = o.dish_id
                    WHERE o.private_kitchen_hub_id != 0
                        AND o.private_kitchen_hub_id IS NOT NULL
                        AND o.order_status IN ('completed', 'request_confirmed', 'confirmed')
                        AND o.delivery_time < UTC_TIMESTAMP()
                    GROUP BY d.buddy_id
            ) AS savedServiceCharge on savedServiceCharge.buddy_id = overallEarnedAmount.buddy_id
            LEFT JOIN (
                SELECT SUM(amount) as paidOverallByCredits, user_id as buddy_id from buddy_wallet
                    WHERE transaction_type = 'DEBIT' AND origin = 'buddy_account_transactions'
                    GROUP BY user_id
            ) AS paidOverAllByCredits on paidOverAllByCredits.buddy_id = overallEarnedAmount.buddy_id
            LEFT JOIN (
                SELECT SUM(credit) AS receivedOnlineOrdersAmount, SUM(debit) AS paidOverallCharge,
                    user_id as buddy_id from buddy_account_transactions
                    GROUP BY user_id
            ) AS creditDebit on creditDebit.buddy_id = overallEarnedAmount.buddy_id`,
            { type: db.sequelize.QueryTypes.SELECT },
        );
    }

    public queryAccountAttrsByUserId = async (buddyId) => {
        const result = await db.sequelize.query(`SELECT overallEarnedAmount.buddy_id as buddyId,
                overallEarnedAmount.overallEarnedAmount,
                overallEarnedAmount.incurredServiceCharge,
                incurredPkGatewayCharge.incurredPkGatewayCharge,
                incurredPkGatewayCharge.pkOnlineOrdersCount,
                incurredPkGatewayCharge.pkOnlineOrdersAmount,
                onlineOrdersAmount.onlineOrdersAmount,
                savedServiceCharge.savedServiceCharge,
                paidOverAllByCredits.paidOverAllByCredits,
                creditDebit.receivedOnlineOrdersAmount,
                creditDebit.paidOverallCharge
                FROM (
                    SELECT SUM(o.net_amount) as overallEarnedAmount,
                    SUM(o.total_service_charge) as incurredServiceCharge,
                    d.buddy_id from orders as o
                    INNER JOIN dishes AS d ON d.id = o.dish_id
                    WHERE o.order_status IN ('completed', 'request_confirmed', 'confirmed')
                    AND o.delivery_time < UTC_TIMESTAMP()
                    AND d.buddy_id = :buddyId
                    GROUP BY d.buddy_id
            ) as overallEarnedAmount
            LEFT JOIN
            (
                SELECT SUM(online_transaction_charges) as incurredPkGatewayCharge,
                        count(o.id) as pkOnlineOrdersCount,
                        SUM(net_amount) AS pkOnlineOrdersAmount, d.buddy_id from orders as o
                    INNER JOIN dishes as d on d.id = o.dish_id
                    WHERE o.private_kitchen_hub_id != 0
                        AND o.private_kitchen_hub_id IS NOT NULL
                        AND o.payment_type != 'CASH_ON_DLY'
                        AND o.order_status IN ('completed', 'request_confirmed', 'confirmed')
                        AND o.delivery_time < UTC_TIMESTAMP()
                        AND d.buddy_id = :buddyId
                    GROUP BY d.buddy_id
            ) as incurredPkGatewayCharge on incurredPkGatewayCharge.buddy_id = overallEarnedAmount.buddy_id
            LEFT JOIN (
                SELECT SUM(
                            IF
                                (
                                    o.payment_type in (
                                                'PAYTM', 'CASHFREE', 'WALLET', 'WALLET_AND_CASHFREE',
                                                'WALLET_AND_PAYTM'
                                ) || h.type = 'office',
                                o.net_amount, o.wallet_amount
                            )
                        )
                    as onlineOrdersAmount,
                    d.buddy_id from orders as o
                INNER JOIN dishes AS d ON d.id = o.dish_id
                INNER JOIN hub AS h ON h.id = o.hub_id
                WHERE o.order_status IN ('completed', 'request_confirmed', 'confirmed')
                AND o.delivery_time < UTC_TIMESTAMP()
                AND d.buddy_id = :buddyId
                GROUP BY d.buddy_id
            ) AS onlineOrdersAmount on onlineOrdersAmount.buddy_id = overallEarnedAmount.buddy_id
            LEFT JOIN (
                SELECT SUM(
                    if (
                        (( CEIL(((net_amount - o.delivery_charge)/ordered_units)/50) - 1) * 5 * ordered_units) >
                            5 * ordered_units,
                        (( CEIL(((net_amount - o.delivery_charge)/ordered_units)/50) - 1) * 5 * ordered_units),
                        5 * ordered_units
                    )
                ) as savedServiceCharge,
                d.buddy_id from orders as o
                    INNER JOIN dishes as d on d.id = o.dish_id
                    WHERE o.private_kitchen_hub_id != 0
                        AND o.private_kitchen_hub_id IS NOT NULL
                        AND o.order_status IN ('completed', 'request_confirmed', 'confirmed')
                        AND o.delivery_time < UTC_TIMESTAMP()
                        AND d.buddy_id = :buddyId
                    GROUP BY d.buddy_id
            ) AS savedServiceCharge on savedServiceCharge.buddy_id = overallEarnedAmount.buddy_id
            LEFT JOIN (
                SELECT SUM(amount) as paidOverallByCredits, user_id as buddy_id from buddy_wallet
                    WHERE transaction_type = 'DEBIT'
                        AND origin = 'buddy_account_transactions'
                        AND user_id = :buddyId
                    GROUP BY user_id
            ) AS paidOverAllByCredits on paidOverAllByCredits.buddy_id = overallEarnedAmount.buddy_id
            LEFT JOIN (
                SELECT SUM(credit) AS receivedOnlineOrdersAmount, SUM(debit) AS paidOverallCharge,
                    user_id as buddy_id from buddy_account_transactions
                    WHERE user_id = :buddyId
                    GROUP BY user_id
            ) AS creditDebit on creditDebit.buddy_id = overallEarnedAmount.buddy_id`,
            { replacements: { buddyId }, type: db.sequelize.QueryTypes.SELECT },
        );
        return (result.length > 0) ? result[0] : null;
    }

    public removeOnlineTransactionChargesFromCodOrders = () => {
        return db.Order.update(
            {
                onlineTransactionCharges: 0,
            },
            {
                where: {
                    paymentType : 'CASH_ON_DLY',
                    onlineTransactionCharges : {
                        [db.sequelize.Op.gt] : 0,
                    },
                },
            },
        );
    }
}
