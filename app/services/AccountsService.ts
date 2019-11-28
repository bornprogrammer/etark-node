import {
    OrdersRepository, UserAccountsRepository,
} from '@app/repositories';
import Logger from './Logger';

export default class AccountsService {
    private userAccountsRepository: UserAccountsRepository;
    private ordersRepository: OrdersRepository;

    public constructor(
        userAccountsRepository: UserAccountsRepository,
        ordersRepository: OrdersRepository,
    ) {
        this.userAccountsRepository = userAccountsRepository;
        this.ordersRepository = ordersRepository;
    }

    public getAccountSummaryByUserId = async (userId: number) => {
        return this.userAccountsRepository.findOne({userId});
    }

    public getUpdatedAccSummary = async (userId: number) => {
        const accAttrs = await this.ordersRepository.queryAccountAttrsByUserId(userId);
        if (!accAttrs) {
            return null;
        }

        const userAcc = await this.userAccountsRepository.findOne({userId: accAttrs.buddyId});
        if (userAcc) {
            userAcc.overallEarnedAmount = accAttrs.overallEarnedAmount;
            userAcc.incurredServiceCharge = accAttrs.incurredServiceCharge;
            userAcc.incurredPkGatewayCharge = accAttrs.incurredPkGatewayCharge;
            userAcc.pkOnlineOrdersCount = accAttrs.pkOnlineOrdersCount;
            userAcc.pkOnlineOrdersAmount = accAttrs.pkOnlineOrdersAmount;
            userAcc.onlineOrdersAmount = accAttrs.onlineOrdersAmount;
            userAcc.savedServiceCharge = accAttrs.savedServiceCharge;
            userAcc.paidOverAllByCredits = accAttrs.paidOverAllByCredits;
            userAcc.receivedOnlineOrdersAmount = accAttrs.receivedOnlineOrdersAmount;
            userAcc.paidOverallCharge = accAttrs.paidOverallCharge;
            await userAcc.save();
        } else {
            await this.userAccountsRepository.create({
                userId: accAttrs.buddyId,
                overallEarnedAmount: accAttrs.overallEarnedAmount,
                incurredServiceCharge: accAttrs.incurredServiceCharge,
                incurredPkGatewayCharge: accAttrs.incurredPkGatewayCharge,
                pkOnlineOrdersCount: accAttrs.pkOnlineOrdersCount,
                pkOnlineOrdersAmount: accAttrs.pkOnlineOrdersAmount,
                onlineOrdersAmount: accAttrs.onlineOrdersAmount,
                savedServiceCharge: accAttrs.savedServiceCharge,
                paidOverAllByCredits: accAttrs.paidOverAllByCredits,
                receivedOnlineOrdersAmount: accAttrs.receivedOnlineOrdersAmount,
                paidOverallCharge: accAttrs.paidOverallCharge,
            });
        }
        return userAcc;
    }

}
