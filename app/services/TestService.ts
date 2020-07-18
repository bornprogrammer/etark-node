/* tslint:disable */

/* 
 * disable linting rules for this file since these are only tests and temporary
 * this file will probably be removed soon
 */
import {
    UserAccountsRepository,
    UserSessionsRepository,
} from '@app/repositories';
import request, {Options} from 'request-promise';
import Logger from './Logger';

/*
 * This service contains logic required for testing new version of acc summary API
 * and comparing the response of new and old versions of acc summary API
 */
export default class TestService {
    private userAccountsRepository: UserAccountsRepository;

    public constructor(userAccountsRepository: UserAccountsRepository) {
        this.userAccountsRepository = userAccountsRepository;
    }

    public testAccSummary = async () => {

        let processingUserId = 0;

        try {

        const maxId = await this.userAccountsRepository.maxId();
        const batchSize = 500;

        let startId = 500;
        let endId = startId + batchSize;
        let users;
        let nonMatchingFields = [];
        const nonMatchingResults = [];
        let matchedCount = 0;
        let totalCompared = 0;

        while (startId <= maxId) {
            users = await this.userAccountsRepository.getUserIdBetweenAccIds(startId, endId);

            let comparisionCount = 1;

            for (const user of users) {

                processingUserId = user.userId;

                comparisionCount++;

                const token = await new UserSessionsRepository().findTokenByUserId(user.userId);

                if (token[0]) {
                    totalCompared++;
                } else {
                    continue;
                }

                const oldApiOptions = {
                    method: 'GET',
                    uri: `http://app.foodybuddy.in/api/v1/users/account?token=${token[0].token}&month=5&year=2019`,
                    json: true,
                    resolveWithFullResponse: true,
                };

                let oldApiResponse;
                try {
                    oldApiResponse = await request(oldApiOptions);
                } catch (err) {
                    Logger.debug('api error');
                    Logger.debug(err);
                    continue;
                }

                const newApiOptions = {
                    method: 'GET',
                    uri: `http://localhost:3000/ts/v1/buddies/${user.userId}/accounts?token=${token[0].token}`,
                    json: true,
                    resolveWithFullResponse: true,
                };

                let accApiResponse;
                try {
                    accApiResponse = await request(newApiOptions);
                } catch (err) {
                    Logger.debug('api error');
                    Logger.debug(err);
                    continue;
                }

                if (oldApiResponse.statusCode === 200 && accApiResponse.statusCode === 200) {
                    nonMatchingFields = [];
                    if (Number(oldApiResponse.body.data.total_amount_earned).toFixed(2) !== Number(accApiResponse.body.data.account.overallEarnedAmount).toFixed(2)) {
                        nonMatchingFields.push(`overallEarnedAmount ${oldApiResponse.body.data.total_amount_earned} - ${accApiResponse.body.data.account.overallEarnedAmount}`);
                    }

                    if (Number(oldApiResponse.body.data.total_service_charge).toFixed(2) !== Number(accApiResponse.body.data.account.incurredServiceCharge).toFixed(2)) {
                        nonMatchingFields.push(`incurredServiceCharge ${oldApiResponse.body.data.total_service_charge} - ${accApiResponse.body.data.account.incurredServiceCharge}`);
                    }

                    if (Number(oldApiResponse.body.data.fb_total_amount).toFixed(2) !== Number(accApiResponse.body.data.account.onlineOrdersAmount).toFixed(2)) {
                        nonMatchingFields.push(`onlineOrdersAmount ${oldApiResponse.body.data.fb_total_amount} - ${accApiResponse.body.data.account.onlineOrdersAmount}`);
                    }

                    if (Number(oldApiResponse.body.data.fb_pending_amount).toFixed(2) !== Number(accApiResponse.body.data.account.pendingOnlineOrdersAmount).toFixed(2)) {
                        nonMatchingFields.push(`pendingOnlineOrdersAmount ${oldApiResponse.body.data.fb_pending_amount} - ${accApiResponse.body.data.account.pendingOnlineOrdersAmount}`);
                    }

                    if (Number(oldApiResponse.body.data.cleared_amount).toFixed(2) !== Number(accApiResponse.body.data.account.receivedOnlineOrdersAmount).toFixed(2)) {
                        nonMatchingFields.push(`receivedOnlineOrdersAmount ${oldApiResponse.body.data.cleared_amount} - ${accApiResponse.body.data.account.receivedOnlineOrdersAmount}`);
                    }

                    if (Number(oldApiResponse.body.data.pk_payment_gateway_charges).toFixed(2) !== Number(accApiResponse.body.data.account.incurredPkGatewayCharge).toFixed(2)) {
                        nonMatchingFields.push(`incurredPkGatewayCharge ${oldApiResponse.body.data.pk_payment_gateway_charges} - ${accApiResponse.body.data.account.incurredPkGatewayCharge}`);
                    }

                    if (Number(oldApiResponse.body.data.pk_plan_charges).toFixed(2) !== Number(accApiResponse.body.data.account.incurredPkPlanCharge).toFixed(2)) {
                        nonMatchingFields.push(`incurredPkPlanCharge ${oldApiResponse.body.data.pk_plan_charges} - ${accApiResponse.body.data.account.incurredPkPlanCharge}`);
                    }

                    if (Number(oldApiResponse.body.data.pk_service_charge_saved).toFixed(2) !== Number(accApiResponse.body.data.account.savedServiceCharge).toFixed(2)) {
                        nonMatchingFields.push(`savedServiceCharge ${oldApiResponse.body.data.pk_service_charge_saved} - ${accApiResponse.body.data.account.savedServiceCharge}`);
                    }

                    if (Number(oldApiResponse.body.data.pk_online_orders_count).toFixed(2) !== Number(accApiResponse.body.data.account.pkOnlineOrdersCount).toFixed(2)) {
                        nonMatchingFields.push(`pkOnlineOrdersCount ${oldApiResponse.body.data.pk_online_orders_count} - ${accApiResponse.body.data.account.pkOnlineOrdersCount}`);
                    }

                    if (Number(oldApiResponse.body.data.total_charges_till_date).toFixed(2) !== Number(accApiResponse.body.data.account.incurredOverallCharge).toFixed(2)) {
                        nonMatchingFields.push(`incurredOverallCharge ${oldApiResponse.body.data.total_charges_till_date} - ${accApiResponse.body.data.account.incurredOverallCharge}`);
                    }

                    if (Number(oldApiResponse.body.data.total_charges_paid).toFixed(2) !== Number(accApiResponse.body.data.account.paidOverallCharge).toFixed(2)) {
                        nonMatchingFields.push(`paidOverallCharge ${oldApiResponse.body.data.total_charges_paid} - ${accApiResponse.body.data.account.paidOverallCharge}`);
                    }

                    if (Number(oldApiResponse.body.data.pending_charges).toFixed(2) !== Number(accApiResponse.body.data.account.pendingOverallCharge).toFixed(2)) {
                        nonMatchingFields.push(`pendingOverallCharge ${oldApiResponse.body.data.pending_charges} - ${accApiResponse.body.data.account.pendingOverallCharge}`);
                    }

                    if (Number(oldApiResponse.body.data.buddy_credit_settlement).toFixed(2) !== Number(accApiResponse.body.data.account.paidOverAllByCredits).toFixed(2)) {
                        nonMatchingFields.push(`paidOverAllByCredits ${oldApiResponse.body.data.buddy_credit_settlement} - ${accApiResponse.body.data.account.paidOverAllByCredits}`);
                    }

                    if (Number(oldApiResponse.body.data.new_paid_via_regular_payments).toFixed(2) !== Number(accApiResponse.body.data.account.paidOverAllRegular).toFixed(2)) {
                        nonMatchingFields.push(`paidOverAllRegular ${oldApiResponse.body.data.new_paid_via_regular_payments} - ${accApiResponse.body.data.account.paidOverAllRegular}`);
                    }

                    const oldApiPlanSubscriptions = oldApiResponse.body.data.pk_plan_subscriptions;
                    const newApiPlanSubscriptions = accApiResponse.body.data.account.pkPlans;

                    for (const index in oldApiPlanSubscriptions) {
                        if (oldApiPlanSubscriptions[index].duration_days !== newApiPlanSubscriptions[index].durationDays) {
                            nonMatchingFields.push(`pkplans : ${index} - duration_days`);
                        }

                        if (oldApiPlanSubscriptions[index].duration_dates !== newApiPlanSubscriptions[index].durationDates) {
                            nonMatchingFields.push(`pkplans : ${index} - durationDates`);
                        }

                        if (Number(oldApiPlanSubscriptions[index].cost_per_day) !== Number(newApiPlanSubscriptions[index].costPerDay)) {
                            nonMatchingFields.push(`pkplans : ${index} - costPerDay`);
                        }

                        if (Number(oldApiPlanSubscriptions[index].total_cost) !== Number(newApiPlanSubscriptions[index].totalCost)) {
                            nonMatchingFields.push(`pkplans : ${index} - totalCost`);
                        }

                        if (oldApiPlanSubscriptions[index].plan_name !== newApiPlanSubscriptions[index].planName) {
                            // nonMatchingFields.push(`pkplans : ${index} - planName`);
                        }
                    }

                    if (nonMatchingFields.length > 0) {
                        nonMatchingResults.push({userId: user.userId, token: token[0].token, fields: nonMatchingFields});
                    } else {
                        matchedCount++;
                    }

                    if (comparisionCount == 100) {
                        comparisionCount = 1;
                        Logger.debug({totalCompared, matchedCount, notMatched: nonMatchingResults.length, nonMatchingResults});
                    }

                } else {
                    Logger.debug(`API call failed ${user.userId}`);
                }
            }
            startId = endId + 1;
            endId += batchSize;
            Logger.debug({totalCompared, matchedCount, notMatched: nonMatchingResults.length, nonMatchingResults});
        }

        return {totalCompared, matchedCount, notMatched: nonMatchingResults.length, nonMatchingFields};
        } catch (error) {
            Logger.debug(`failed at ${processingUserId} `);
            Logger.debug(error.stack);
        }
    }

    public testAllOrders = async () => {

        try {
            const maxId = await this.userAccountsRepository.maxId();
            const batchSize = 500;

            let startId = 1;
            let endId = startId + batchSize;
            let users;
            let nonMatchingFields = [];
            const nonMatchingResults = [];
            let matchedCount = 0;
            let totalCompared = 0;

            while (startId <= maxId) {
                users = await this.userAccountsRepository.getUserIdBetweenAccIds(startId, endId);

                for (const user of users) {

                    const token = await new UserSessionsRepository().findTokenByUserId(user.userId);

                    if (token[0]) {
                        totalCompared++;
                    } else {
                        continue;
                    }

                    const dates = [
                        {month: 10, year: 2018},
                        {month: 11, year: 2018},
                        {month: 12, year: 2018},
                        {month: 1, year: 2019},
                        {month: 2, year: 2019},
                        {month: 3, year: 2019},
                        {month: 4, year: 2019},
                    ];

                    const nonMatchData = [];

                    for (const date of dates) {
                        const oldApiOptions = {
                            method: 'GET',
                            uri: `http://stage.foodybuddy.in/api/v1/users/account?token=${token[0].token}&month=${date.month}&year=${date.year}`,
                            json: true,
                            resolveWithFullResponse: true,
                        };

                        let oldApiResponse;
                        try {
                            oldApiResponse = await request(oldApiOptions);
                        } catch (err) {
                            Logger.debug('api error');
                            Logger.debug(err);
                            continue;
                        }

                        const newApiOptions = {
                            method: 'GET',
                            uri: `http://localhost:3000/ts/v1/buddies/${user.userId}/orders?month=${date.month}&year=${date.year}&token=${token[0].token}`,
                            json: true,
                            resolveWithFullResponse: true,
                        };

                        let accApiResponse;
                        try {
                            accApiResponse = await request(newApiOptions);
                        } catch (err) {
                            Logger.debug('api error');
                            Logger.debug(err);
                            continue;
                        }

                        if (oldApiResponse.statusCode === 200 && accApiResponse.statusCode === 200) {
                            nonMatchingFields = [];

                            const oldApiOrders = oldApiResponse.body.data.orders;
                            const newApiOrders = accApiResponse.body.data.orders;

                            // if (oldApiOrders.length !== newApiOrders.length) {
                            //     nonMatchingResults.push({userId: user.userId, token: token[0].token, fields: 'length mismatch', params: date});
                            //     continue;
                            // }

                            // Logger.debug(oldApiOrders);

                            // oldApiOrders = oldApiOrders.sort((a, b) => oldApiOrders.order_id - oldApiOrders.order_id);

                            // Logger.debug(oldApiOrders);

                            let oldOrderIds = [];
                            const newOrderIds = [];

                            for (const index in oldApiOrders) {

                                oldOrderIds.push(oldApiOrders[index].order_id);

                                if (newApiOrders[index]) {
                                    newOrderIds.push(newApiOrders[index].id);
                                }

                                // if (newApiOrders[index].netAmount !== oldApiOrders[index].net_amount) {
                                //     nonMatchingFields.push(`netAmount : ${index}: ${newApiOrders[index].netAmount} - ${oldApiOrders[index].net_amount}`);
                                // }

                                // if (newApiOrders[index].totalServiceCharge !== oldApiOrders[index].total_service_charge) {
                                //     nonMatchingFields.push(`totalServiceCharge : ${index}: ${newApiOrders[index].totalServiceCharge} - ${oldApiOrders[index].total_service_charge}`);
                                // }

                                // if (newApiOrders[index].dish.name !== oldApiOrders[index].name) {
                                //     nonMatchingFields.push(`dish.name : ${index}: ${newApiOrders[index].dish.name} - ${oldApiOrders[index].name}`);
                                // }

                                // if (newApiOrders[index].user.name !== oldApiOrders[index].foody_name) {
                                //     nonMatchingFields.push(`user.name : ${index}: ${newApiOrders[index].user.name} - ${oldApiOrders[index].foody_name}`);
                                // }
                            }

                            oldOrderIds = oldOrderIds.map(function(x) {
                                return parseInt(x, 10);
                            });

                            const difference = oldOrderIds.filter((x) => !newOrderIds.includes(x)).concat(newOrderIds.filter((x) => !oldOrderIds.includes(x)));

                            if (difference.length > 0) {
                                nonMatchingFields.push({msg : 'diff order ids', difference});
                            }

                        } else {
                            Logger.debug(`API call failed ${user.userId}`);
                        }

                        if (nonMatchingFields.length > 0) {
                            nonMatchData.push({data: nonMatchingFields, params: date});
                        }
                    }

                    if (nonMatchingFields.length > 0) {
                        nonMatchingResults.push({userId: user.userId, token: token[0].token, fields: nonMatchingFields});
                    } else {
                        matchedCount++;
                    }
                    Logger.debug({totalCompared, matchedCount, notMatched: nonMatchingResults.length, nonMatchingResults});
                }
                startId = endId + 1;
                endId += batchSize;
                Logger.debug({totalCompared, matchedCount, notMatched: nonMatchingResults.length, nonMatchingResults});
            }

            return {totalCompared, matchedCount, notMatched: nonMatchingResults.length, nonMatchingFields};
        } catch (err) {
            Logger.debug(err.stack);
        }
    }

    public testAllPkOrders = async () => {

        try {
            const maxId = await this.userAccountsRepository.maxId();
            const batchSize = 500;

            let startId = 1;
            let endId = startId + batchSize;
            let users;
            let nonMatchingFields = [];
            const nonMatchingResults = [];
            let matchedCount = 0;
            let totalCompared = 0;

            while (startId <= maxId) {
                users = await this.userAccountsRepository.getUserIdBetweenAccIds(startId, endId);

                for (const user of users) {

                    const token = await new UserSessionsRepository().findTokenByUserId(user.userId);

                    if (token[0]) {
                        totalCompared++;
                    } else {
                        continue;
                    }

                    const dates = [
                        {month: 10, year: 2018},
                        {month: 11, year: 2018},
                        {month: 12, year: 2018},
                        {month: 1, year: 2019},
                        {month: 2, year: 2019},
                        {month: 3, year: 2019},
                        {month: 4, year: 2019},
                    ];

                    const nonMatchData = [];

                    for (const date of dates) {
                        const oldApiOptions = {
                            method: 'GET',
                            uri: `http://app.foodybuddy.in/api/v1/users/account?token=${token[0].token}&pk_orders_only=1&month=${date.month}&year=${date.year}`,
                            json: true,
                            resolveWithFullResponse: true,
                        };

                        let oldApiResponse;
                        try {
                            oldApiResponse = await request(oldApiOptions);
                        } catch (err) {
                            Logger.debug('api error');
                            Logger.debug(err);
                            continue;
                        }

                        const newApiOptions = {
                            method: 'GET',
                            uri: `http://localhost:3000/ts/v1/buddies/${user.userId}/orders?pk_orders_only=true&month=${date.month}&year=${date.year}&token=${token[0].token}`,
                            json: true,
                            resolveWithFullResponse: true,
                        };

                        let accApiResponse;
                        try {
                            accApiResponse = await request(newApiOptions);
                        } catch (err) {
                            Logger.debug('api error');
                            Logger.debug(err);
                            continue;
                        }

                        if (oldApiResponse.statusCode === 200 && accApiResponse.statusCode === 200) {
                            nonMatchingFields = [];

                            const oldApiOrders = oldApiResponse.body.data.orders;
                            const newApiOrders = accApiResponse.body.data.orders;

                            // if (oldApiOrders.length !== newApiOrders.length) {
                            //     nonMatchingResults.push({userId: user.userId, token: token[0].token, fields: 'length mismatch', params: date});
                            //     continue;
                            // }

                            // Logger.debug(oldApiOrders);

                            // oldApiOrders = oldApiOrders.sort((a, b) => oldApiOrders.order_id - oldApiOrders.order_id);

                            // Logger.debug(oldApiOrders);

                            let oldOrderIds = [];
                            const newOrderIds = [];

                            for (const index in oldApiOrders) {

                                oldOrderIds.push(oldApiOrders[index].id);
                                if (newApiOrders[index]) {
                                    newOrderIds.push(newApiOrders[index].id);
                                }

                                // if (newApiOrders[index].netAmount !== oldApiOrders[index].net_amount) {
                                //     nonMatchingFields.push(`netAmount : ${index}: ${newApiOrders[index].netAmount} - ${oldApiOrders[index].net_amount}`);
                                // }

                                // if (newApiOrders[index].totalServiceCharge !== oldApiOrders[index].total_service_charge) {
                                //     nonMatchingFields.push(`totalServiceCharge : ${index}: ${newApiOrders[index].totalServiceCharge} - ${oldApiOrders[index].total_service_charge}`);
                                // }

                                // if (newApiOrders[index].dish.name !== oldApiOrders[index].name) {
                                //     nonMatchingFields.push(`dish.name : ${index}: ${newApiOrders[index].dish.name} - ${oldApiOrders[index].name}`);
                                // }

                                // if (newApiOrders[index].user.name !== oldApiOrders[index].foody_name) {
                                //     nonMatchingFields.push(`user.name : ${index}: ${newApiOrders[index].user.name} - ${oldApiOrders[index].foody_name}`);
                                // }
                            }

                            oldOrderIds = oldOrderIds.map(function(x) {
                                return parseInt(x, 10);
                            });

                            const difference = oldOrderIds.filter((x) => !newOrderIds.includes(x)).concat(newOrderIds.filter((x) => !oldOrderIds.includes(x)));

                            if (difference.length > 0) {
                                nonMatchingFields.push({msg : 'diff order ids', difference});
                            }

                        } else {
                            Logger.debug(`API call failed ${user.userId}`);
                        }

                        if (nonMatchingFields.length > 0) {
                            nonMatchData.push({data: nonMatchingFields, params: date});
                        }
                    }

                    if (nonMatchingFields.length > 0) {
                        nonMatchingResults.push({userId: user.userId, token: token[0].token, fields: nonMatchingFields});
                    } else {
                        matchedCount++;
                    }
                    Logger.debug({totalCompared, matchedCount, notMatched: nonMatchingResults.length, nonMatchingResults});
                }
                startId = endId + 1;
                endId += batchSize;
                Logger.debug({totalCompared, matchedCount, notMatched: nonMatchingResults.length, nonMatchingResults});
            }

            return {totalCompared, matchedCount, notMatched: nonMatchingResults.length, nonMatchingFields};
        } catch (err) {
            Logger.debug(err.stack);
        }
    }

}
