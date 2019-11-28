import { ChainingMethodParamsEntity } from '@app/method-handler/ChainingMethodParamsEntity';
import { repositoryMethodHandlerIns } from '@app/method-handler/RepositoryMethodHandler';
import BaseRepository from '@app/repositories/BaseRepository';
import { orderModelIns } from './OrderModel';

export class OrderRepository extends BaseRepository {

    constructor() {
        super();
    }

    public addOrder = async (chainingMethodParamsEntityObj: ChainingMethodParamsEntity) => {
        const params = chainingMethodParamsEntityObj.getTopParams();
        const results = await repositoryMethodHandlerIns.setParams(params).setMethodHandler(orderModelIns.addOrder).get();
        return results;
    }

    public deleteOrder = async (orderId) => {
        const results = await repositoryMethodHandlerIns.setParams(orderId).setMethodHandler(orderModelIns.deleteOrder).get();
        return results;
    }

    public getOrderInfoByOrderId = async (params) => {
        const results = await repositoryMethodHandlerIns.setParams(params).setMethodHandler(orderModelIns.getOrderInfoByOrderId).get();
        return results;
    }

    public getWebOrderInfo = async (orderTxnId) => {
        const results = await repositoryMethodHandlerIns.setParams(orderTxnId).setMethodHandler(orderModelIns.getWebOrderInfo).get();
        return results;
    }
}

export const orderRepositoryIns = new OrderRepository();
