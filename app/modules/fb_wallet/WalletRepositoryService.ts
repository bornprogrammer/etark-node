import ExpectationFailedError from '@app/errors/ExpectationFailedError';
import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import BaseRepositoryService from '@app/services/BaseRepositoryService';
import { WalletRepository, walletRepositoryIns } from './WalletRepository';

class WalletRepositoryService extends BaseRepositoryService {

    constructor(walletRepository: WalletRepository) {
        super(walletRepository);
    }

    public updateWalletAmount = async (userId) => {
        let walletInfo = await this.getWalletBalance(userId);
        return await repositoryServiceMethodHandlerIns.setParams({ userId, bal: walletInfo.total }).setMethodHandler(this.mRepository.updateWalletAmount).get();
    }

    public deductOrAddWalletBalance = async (params) => {
        return await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.deductOrAddWalletBalance).setParams(params).get();
    }

    public getWalletBalance = async (userId) => {
        let wallet = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getWalletBalance).setParams(userId).get();
        console.log(wallet)
        let walletInfo = { promotionalTotal: 0, regularTotal: 0, total: 0 }
        if (wallet.debit_amount < wallet.credit_amount)
            walletInfo.regularTotal = wallet.credit_amount - wallet.debit_amount;
        if (wallet.promotions_debit_amount < wallet.promotions_credit_amount)
            walletInfo.promotionalTotal = wallet.promotions_credit_amount - wallet.promotions_debit_amount;
        walletInfo.total = walletInfo.promotionalTotal + walletInfo.regularTotal
        console.log(walletInfo)
        return walletInfo;
    }

    public getWalletInfo = async (params) => {
        return await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getWalletInfo).setParams(params).get();
    }
}
export const walletRepositoryServiceIns = new WalletRepositoryService(walletRepositoryIns);
