import { repositoryMethodHandlerIns } from '@app/method-handler/RepositoryMethodHandler';
import BaseRepository from '@app/repositories/BaseRepository';
import { walletModelIns } from './WalletModel';

export class WalletRepository extends BaseRepository {
    constructor() {
        super();
    }

    public updateWalletAmount = async (params) => {
        const shippingAddress = await repositoryMethodHandlerIns.setParams(params).setMethodHandler(walletModelIns.updateWalletAmount).get();
        return shippingAddress;
    }

    public deductOrAddWalletBalance = async (data) => {
        const eAddressResult = await repositoryMethodHandlerIns.setMethodHandler(walletModelIns.deductOrAddWalletBalance).setParams(data).get();
        return eAddressResult;
    }

    public getWalletBalance = async (userId) => {
        const eAddressResult = await repositoryMethodHandlerIns.setMethodHandler(walletModelIns.getWalletBalance).setParams(userId).get();
        return eAddressResult;
    }

    public getWalletInfo = async (params) => {
        const eAddressResult = await repositoryMethodHandlerIns.setMethodHandler(walletModelIns.getWalletInfo).setParams(params).get();
        return eAddressResult;
    }
}

export const walletRepositoryIns = new WalletRepository();
