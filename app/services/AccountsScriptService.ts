import PrivateKitchenConstants from '@app/constants/PrivateKitchenConstants';
import {
    AccountTransactionsRepository,
    BuddyAccountTransactionsRepository,
    BuddyWalletRepository,
    OrdersRepository,
    PrivateKitchensRepository,
    PrivateKitchenSubscriptionsRepository,
    UserAccountsRepository,
} from '@app/repositories';
import moment from 'moment';

/*
 * This service contains all the scripts required by cron and scripts
 * required to do any migration work for new version of account summary API
 */
export default class AccountsScriptService {
    private ordersRepository: OrdersRepository;
    private userAccountsRepository: UserAccountsRepository;
    private accountTransactionsRepository: AccountTransactionsRepository;
    private buddyAccountTransactionsRepository: BuddyAccountTransactionsRepository;
    private privateKitchensRepository: PrivateKitchensRepository;
    private privateKitchenSubscriptionsRepository: PrivateKitchenSubscriptionsRepository;
    private buddyWalletRepository: BuddyWalletRepository;

    public constructor(userAccountsRepository: UserAccountsRepository,
                       ordersRepository: OrdersRepository,
                       accountTransactionsRepository: AccountTransactionsRepository,
                       buddyAccountTransactionsRepository: BuddyAccountTransactionsRepository,
                       privateKitchensRepository: PrivateKitchensRepository,
                       privateKitchenSubscriptionsRepository: PrivateKitchenSubscriptionsRepository,
                       buddyWalletRepository: BuddyWalletRepository,
        ) {
        this.userAccountsRepository = userAccountsRepository;
        this.ordersRepository = ordersRepository;
        this.accountTransactionsRepository = accountTransactionsRepository;
        this.buddyAccountTransactionsRepository = buddyAccountTransactionsRepository;
        this.privateKitchensRepository = privateKitchensRepository;
        this.privateKitchenSubscriptionsRepository = privateKitchenSubscriptionsRepository;
        this.buddyWalletRepository = buddyWalletRepository;
    }

    public updateAccountSummary = async () => {
        const userAccountAttributes = await this.ordersRepository.queryUserAccountAttrs();

        let created = 0;
        let updated = 0;
        let userAcc;

        for (const accAttr of userAccountAttributes) {
            userAcc = await this.userAccountsRepository.findOne({userId: accAttr.buddyId});
            if (userAcc) {
                userAcc.overallEarnedAmount = accAttr.overallEarnedAmount;
                userAcc.incurredServiceCharge = accAttr.incurredServiceCharge;
                userAcc.incurredPkGatewayCharge = accAttr.incurredPkGatewayCharge;
                userAcc.pkOnlineOrdersCount = accAttr.pkOnlineOrdersCount;
                userAcc.pkOnlineOrdersAmount = accAttr.pkOnlineOrdersAmount;
                userAcc.onlineOrdersAmount = accAttr.onlineOrdersAmount;
                userAcc.savedServiceCharge = accAttr.savedServiceCharge;
                userAcc.paidOverAllByCredits = accAttr.paidOverAllByCredits;
                userAcc.receivedOnlineOrdersAmount = accAttr.receivedOnlineOrdersAmount;
                userAcc.paidOverallCharge = accAttr.paidOverallCharge;

                await userAcc.save();
                updated++;
            } else {
                await this.userAccountsRepository.create({
                    userId: accAttr.buddyId,
                    overallEarnedAmount: accAttr.overallEarnedAmount,
                    incurredServiceCharge: accAttr.incurredServiceCharge,
                    incurredPkGatewayCharge: accAttr.incurredPkGatewayCharge,
                    pkOnlineOrdersCount: accAttr.pkOnlineOrdersCount,
                    pkOnlineOrdersAmount: accAttr.pkOnlineOrdersAmount,
                    onlineOrdersAmount: accAttr.onlineOrdersAmount,
                    savedServiceCharge: accAttr.savedServiceCharge,
                    paidOverAllByCredits: accAttr.paidOverAllByCredits,
                    receivedOnlineOrdersAmount: accAttr.receivedOnlineOrdersAmount,
                    paidOverallCharge: accAttr.paidOverallCharge,
                });
                created++;
            }
        }

        return {created, updated};
    }

    /*
     * updates paidOverallCharge and receivedOnlineOrdersAmount columns of account summary
     * needs to be run after account settlement of buddys
     */
    public updateCreditDebitInAccounts = async () => {

        let created = 0;
        let updated = 0;
        let userAcc;

        const userAccountAttributes: any = await this.buddyAccountTransactionsRepository
                                                    .findTotalDebitCreditForAllUsers();

        for (const accAttr of userAccountAttributes) {
            userAcc = await this.userAccountsRepository.findOne({userId: accAttr.userId});

            if (userAcc) {
                userAcc.paidOverallCharge = accAttr.debit;
                userAcc.receivedOnlineOrdersAmount = accAttr.credit;
                await userAcc.save();
                updated++;
            } else {
                await this.userAccountsRepository.create({
                    userId: accAttr.buddyId,
                    paidOverallCharge: accAttr.debit,
                    receivedOnlineOrdersAmount: accAttr.credit,
                });
                created++;
            }
        }

        return {created, updated};
    }

    /*
     * copies data from legacy user_transaction table to buddy_account_transactions table
     * won't be required once we migrate to revamped account summary
     */
    public populateBuddyAccountTransactions = async () => {

        let createdCount = 0;

        const accountTransactionsCount = await this.accountTransactionsRepository.findMaxId();

        const batchSize = 500;

        let startId = 1;
        let endId = (accountTransactionsCount < batchSize) ? accountTransactionsCount : batchSize;
        while (startId <= accountTransactionsCount) {
            createdCount += await this.copyRowsToBuddyTransactions(startId, endId);
            startId = endId + 1;
            endId += batchSize;
        }

        return createdCount;
    }

    public updatePkPlansInAccountSummary = async () => {
        const maxPkId = await this.privateKitchensRepository.maxId();

        const batchSize = 500;
        let startId = 1;
        let endId = batchSize;
        let pkSubscriptions = [];
        let privateKitchens = [];
        let userAcc;
        let createdCount = 0;
        let updatedCount = 0;
        let incurredPkPlanCharge = 0;
        let formattedPkPlans;
        let billedPlans;

        while (startId <= maxPkId) {
            privateKitchens = await this.privateKitchensRepository.findAllUserIdsBetweenIds(startId, maxPkId);

            for (const privateKitchen of privateKitchens ) {
                pkSubscriptions = await this.privateKitchenSubscriptionsRepository
                                            .findAllByUserId(privateKitchen.createdBy);

                billedPlans = this.getBilledPlans(pkSubscriptions);

                incurredPkPlanCharge = this.calculatePkPlanCharges(billedPlans);
                formattedPkPlans = this.formatPkSubscriptions(billedPlans);

                userAcc = await this.userAccountsRepository.findOne({userId: privateKitchen.createdBy});

                if (userAcc) {
                    userAcc.pkPlans = formattedPkPlans;
                    userAcc.incurredPkPlanCharge = incurredPkPlanCharge;
                    await userAcc.save();
                    updatedCount++;
                } else {
                    await this.userAccountsRepository.create({
                        userId: privateKitchen.createdBy,
                        pkPlans: formattedPkPlans,
                        incurredPkPlanCharge,
                    });
                    createdCount++;
                }
            }

            startId = endId + 1;
            endId += batchSize;
        }

        return {createdCount, updatedCount};
    }

    /*
     * duplicates the debit rows in buddy wallet table with origin as buddy_account_transactions
     */
    public duplicateBuddyWalletDebitsWithUpdatedOrigin = async () => {

        let createdCount = 0;
        const debitTransactions: any = await this.buddyWalletRepository.findDebitTransctions();

        for (const debitTransaction of debitTransactions) {
            delete debitTransaction.id;
            debitTransaction.origin = 'buddy_account_transactions';
            await this.buddyWalletRepository.create(debitTransaction);
            createdCount++;
        }

        return {createdCount};
    }

    public addMissingStatusInPk = async () => {
        const privateKitchens = await this.privateKitchensRepository.findAllPksWithBlankStatus();
        let subscription;
        let updatedCount = 0;

        for (const privateKitchen of privateKitchens) {
            subscription = await this.privateKitchenSubscriptionsRepository
                                    .findLatestSubscriptionByPkId(privateKitchen.id);
            if (subscription.endDate) {
                privateKitchen.status = PrivateKitchenConstants.STATUS.PAUSED;
                await privateKitchen.save();
                updatedCount++;
            } else {
                privateKitchen.status = PrivateKitchenConstants.STATUS.ACTIVE;
                await privateKitchen.save();
                updatedCount++;
            }
        }
        return {updatedCount};
    }

    private copyRowsToBuddyTransactions = async (startId, endId) => {

        const accountTransactions: any = await this.accountTransactionsRepository
                                                .fetchRecordsInIdRange(startId, endId);
        const createdCount = accountTransactions.length;

        for (const accountTransaction of accountTransactions) {
            accountTransaction.userId = accountTransaction['userAccountOld.user_id'];
            delete accountTransaction['userAccountOld.user_id'];
        }

        if (createdCount > 0) {
            await this.buddyAccountTransactionsRepository.bulkCreate(accountTransactions);
        }
        return createdCount;
    }

    private calculatePkPlanCharges = (pkPlans): number => {
        let totalCost = 0;
        for (const pkPlan of pkPlans) {
            totalCost += pkPlan.amount;
        }
        return totalCost;
    }

    private getBilledPlans = (pkSubscriptions) => {

        const billedPlans = [];
        let planToBill;

        let lastBilledPlan;

        const currentYMD = moment().utcOffset('+05:30').format('YYYY-MM-DD');
        const currentDate = moment(currentYMD + ' 00:00:00', 'YYYY-MM-DD HH:mm:ss');
        const currentYM = currentDate.format('YYYY-MM');

        let subscriptionEndDate;
        let subscriptionStartYMD;
        let subscriptionStartYM;
        let subscriptionEndAction;
        let subscriptionEndYMD;
        let subscriptionEndYM;
        let planToBillEndDate;
        let planToBillStartDate;
        let planToBillEndDateY;
        let planToBillEndDateM;
        let planToBillEndDateYM;
        let planToBillStartMonthEndDate;
        let planToBillEndMonthEndDate;
        let planToBillEndMonthStartDate;

        for (let index = 0; index < pkSubscriptions.length; index++) {

            const pkSubscription = pkSubscriptions[index];

            const subscriptionStartDate = moment(pkSubscription.startDate).utcOffset('+05:30').startOf('day');

            // ignore subscriptions that started today since we don't bill the user for the current day
            if (subscriptionStartDate.isSame(currentDate)) {
                continue;
            }

            if (pkSubscription.endDate) {
                subscriptionEndDate = moment(pkSubscription.endDate).utcOffset('+05:30');
            } else {
                subscriptionEndDate = currentDate.clone();
            }

            subscriptionStartYMD = subscriptionStartDate.format('YYYY-MM-DD');
            subscriptionStartYM = subscriptionStartDate.format('YYYY-MM');

            subscriptionEndYMD = subscriptionEndDate.format('YYYY-MM-DD');
            subscriptionEndYM = subscriptionEndDate.format('YYYY-MM');

            subscriptionEndAction = pkSubscription.endAction;

            planToBill = pkSubscription.dataValues;
            planToBill.startDate = subscriptionStartYMD;
            planToBill.endDate = subscriptionEndYMD;
            planToBill.amount = 0;

            planToBillEndDate = subscriptionEndDate.clone();
            planToBillStartDate = subscriptionStartDate.clone();

            planToBillEndDateY = planToBillEndDate.year();
            planToBillEndDateM = planToBillEndDate.month() + 1;
            planToBillEndDateYM = planToBillEndDate.format('YYYY-MM');

            planToBillStartMonthEndDate = planToBillStartDate.clone().endOf('month');

            planToBillEndMonthStartDate = planToBillEndDate.clone().startOf('month');
            planToBillEndMonthEndDate = planToBillEndDate.clone().endOf('month');

            // modify last plan end date or curr plan start date if required
            if (billedPlans.length > 0) {
                lastBilledPlan = billedPlans[billedPlans.length - 1];

                if (lastBilledPlan.endDate === planToBill.startDate) {

                    if (lastBilledPlan.privateKitchenPlanHubPrice.effectivePricePerDay >
                        planToBill.privateKitchenPlanHubPrice.effectivePricePerDay) {

                        // last billed plan has higher value for that day, so let it be
                        // bill for plan to be billed from next day

                        if (planToBill.startDate !== planToBill.endDate) {
                            planToBill.startDate = moment(planToBill.startDate, 'YYYY-MM-DD')
                                                    .add(1, 'days').format('YYYY-MM-DD');
                        } else {
                            // plan starts and ends on the same day and
                            // another plan is suppose to be charged on this day
                            // so just ignore it and move to next plan
                            continue;
                        }

                    } else {
                        // plan to be billed has higher value so lets bill this plan on overlapping date
                        // modify the last billed plan to not bill the overlapping date in it

                        if (lastBilledPlan.startDate !== lastBilledPlan.endDate) {

                            lastBilledPlan.endDate = moment(lastBilledPlan.endDate,
                                                            'YYYY-MM-DD')
                                                        .subtract(1, 'days').format('YYYY-MM-DD');
                            lastBilledPlan.amount = lastBilledPlan.amount -
                                lastBilledPlan.privateKitchenPlanHubPrice.effectivePricePerDay;

                            // update billed_plans array
                            billedPlans.pop();
                            billedPlans.push(lastBilledPlan);
                        } else {
                            // remove last plan from billed plans
                            billedPlans.pop();
                        }
                    }
                }
            }

            // if start date of plantobill happens to be current date after the modifications then just ignore it
            // since we dont bill the user for current date
            if (planToBill.startDate === currentYMD) {
                continue;
            }

            if (subscriptionStartYM === subscriptionEndYM) {
                // SAME MONTH

                if (subscriptionEndAction !== 'change_plan') {
                    // PAUSE ACTION OR NULL

                    if (pkSubscriptions[index + 1]) {
                        const nextSubscription = pkSubscriptions[index + 1];
                        const nextSubscriptionStartDate = moment(nextSubscription.startDate)
                                                                .utcOffset('+05:30').startOf('day');

                        const nextSubscriptionStartDateYM = nextSubscriptionStartDate.format('YYYY-MM');

                        planToBillStartDate = moment(planToBill.startDate).utcOffset('+05:30').startOf('day');

                        if (planToBillEndDateYM === nextSubscriptionStartDateYM) {
                            planToBill.endDate = nextSubscriptionStartDate.format('YYYY-MM-DD');
                        } else {
                            if (planToBillEndDateYM === currentYM) {
                                planToBill.endDate = currentYMD;
                            } else {
                                planToBill.endDate = planToBillEndMonthEndDate.format('YYYY-MM-DD');
                            }
                        }
                    } else {
                        if (planToBillEndDateYM === currentYM) {
                            // bill untill yestrday only
                            planToBill.endDate = currentDate.clone().subtract(1, 'days').format('YYYY-MM-DD');

                            // commented following line as it causes issue when plan started yesterday
                            // optionally check if planToBill end_date > start_date
                        } else {
                            planToBill.endDate = planToBillEndMonthEndDate.format('YYYY-MM-DD');
                        }
                    }
                }

                planToBillEndDate = moment(planToBill.endDate).utcOffset('+05:30').startOf('day');
                planToBillStartDate = moment(planToBill.startDate).utcOffset('+05:30').startOf('day');

                // if start date of plan is current date then skip this plan for billing
                if (planToBillStartDate === currentDate) {
                    continue;
                }

                // if end date of plan is current date then don't bill the last date (i.e. current date)
                if (planToBillEndDate === currentDate) {
                    planToBillEndDate.subtract(1, 'days');
                    planToBill.endDate = planToBillEndDate.format('YYYY-MM-DD');
                }

                let days = planToBillEndDate.diff(planToBillStartDate, 'days');
                days += 1; // the entire end date has to be charged
                planToBill.amount += days * planToBill.privateKitchenPlanHubPrice.effectivePricePerDay;
                billedPlans.push(planToBill);
            } else {
                // subscription starts and ends in different months
                // blindly charge for first month no matter what the plan is

                let days = planToBillStartMonthEndDate.diff(planToBillStartDate, 'days');
                days += 1; // the entire end date has to be charged
                planToBill.amount += days * planToBill.privateKitchenPlanHubPrice.effectivePricePerDay;

                // bill for the months between start and end month
                let cursorMonth = planToBillStartDate.month() + 1;
                let cursorYear = planToBillStartDate.year();

                // increment cursorMonth by 1 since first month has already been charged
                if (cursorMonth === 12) {
                    cursorMonth = 1;
                    cursorYear += 1;
                } else {
                    cursorMonth += 1;
                }

                // iterate all the months in b/w and bill them
                if (cursorYear < planToBillEndDateY) {
                    // bill for years before end date year
                    while (cursorYear < planToBillEndDateY) {
                        while (cursorMonth <= 12) {
                            planToBill.amount += planToBill.privateKitchenPlanHubPrice.discountedPrice;
                            cursorMonth++;
                        }
                        cursorMonth = 1;
                        cursorYear++;
                    }
                    cursorMonth = 1;

                    // bill for all the months in plan end date year
                    while (cursorMonth < planToBillEndDateM) {
                        planToBill.amount += planToBill.privateKitchenPlanHubPrice.discountedPrice;
                        cursorMonth ++;
                    }
                } else {
                    while (cursorMonth < planToBillEndDateM) {
                        planToBill.amount += planToBill.privateKitchenPlanHubPrice.discountedPrice;
                        cursorMonth ++;
                    }
                }

                // find out the appropriate sub end date if plan is paused or null
                if (subscriptionEndAction !== 'change_plan') {

                    if (pkSubscriptions[index + 1]) {

                        const nextSubscription = pkSubscriptions[index + 1];
                        const nextSubscriptionStartDate = moment(nextSubscription.startDate)
                                                                .utcOffset('+05:30').startOf('day');
                        const nextSubscriptionStartDateYM = nextSubscriptionStartDate.format('YYYY-MM');
                        planToBillStartDate = moment(planToBill.startDate).utcOffset('+05:30').startOf('day');

                        if (planToBillEndDateYM === nextSubscriptionStartDateYM) {
                            planToBill.endDate = nextSubscriptionStartDate.format('YYYY-MM-DD');
                        } else {
                            if (planToBillEndDateYM === currentYM) {
                                planToBill.endDate = currentYMD;
                            } else {
                                planToBill.endDate = planToBillEndMonthEndDate.format('YYYY-MM-DD');
                            }
                        }

                    } else {

                        if (planToBillEndDateYM === currentYM) {
                            // bill untill yestrday only
                            planToBill.endDate = currentDate.clone().subtract(1, 'days').format('YYYY-MM-DD');
                            planToBill.amount -= planToBill.privateKitchenPlanHubPrice.effectivePricePerDay;
                        } else {
                            planToBill.endDate = planToBillEndMonthEndDate.format('YYYY-MM-DD');
                        }
                    }
                }

                // bill for last month
                planToBillEndDate = moment(planToBill.endDate);

                if (planToBillEndDate === currentDate) {
                    planToBillEndDate.subtract(1, 'days').format('YYYY-MM-DD');
                    planToBill.endDate = planToBillEndDate.format('YYYY-MM-DD');
                }

                days = planToBillEndDate.diff(planToBillEndMonthStartDate, 'days');
                days += 1; // the entire end date has to be charged
                planToBill.amount += days * planToBill.privateKitchenPlanHubPrice.effectivePricePerDay;
                billedPlans.push(planToBill);
            }
        }
        return billedPlans;
    }

    private formatPkSubscriptions = (pkPlans) => {
        const formatedSubscriptions = [];

        let startDate;
        let endDate;
        let days;

        for (const pkPlan of pkPlans) {
            startDate = moment(pkPlan.startDate, 'YYYY-MM-DD');
            endDate = moment(pkPlan.endDate, 'YYYY-MM-DD');

            days = endDate.diff(startDate, 'days') + 1;
            const formattedSubscription: any = {};
            formattedSubscription.durationDays = (days === 1) ? `${days} day` : `${days} days`;

            formattedSubscription.durationDates = startDate.clone().format('DD MMM YYYY') + ' - ' +
                                                    endDate.clone().format('DD MMM YYYY');

            formattedSubscription.costPerDay = pkPlan.privateKitchenPlanHubPrice.effectivePricePerDay;
            formattedSubscription.totalCost = pkPlan.amount;
            formattedSubscription.planName = pkPlan.privateKitchenPlanHubPrice.privateKitchenPlan.name + ' plan';

            formatedSubscriptions.push(formattedSubscription);
        }

        return formatedSubscriptions;
    }

}
