import { chainingMethodHandlerIns } from '@app/method-handler/ChainingMethodHandler';
import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import { DateHelper } from '@app/modules/helper/DateHelper';
import { inputHelperIns } from '@app/modules/helper/InputHelper';
import BaseRepositoryService from '@app/services/BaseRepositoryService';
import { orderRepositoryServiceIns } from './../order/OrderRepositoryService';
import { cartRepositoryServiceIns } from './../V1cart/CartRepositoryService';
import { OrderFailureRepository, orderFailureRepositoryIns } from './OrderFailureRepository';

export class OrderFailureRepositoryService extends BaseRepositoryService {

    constructor(orderFailureRepository: OrderFailureRepository) {
        super(orderFailureRepository);
    }


    public getPendingOrders = async () => {
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getPendingOrders).get();
        // let cart_ids = result.map(r => r.cart_id).filter((c, i, arr) => arr.indexOf(c) === i)
        // let order_ids = result.map(r => r.order_id).filter((o, i, arr) => arr.indexOf(o) === i && o > 0) 
        for (var r of result) {
            if (r.order_id && r.order_id > 0) {
                const orderResult = await orderRepositoryServiceIns.deleteOrder({ orderId: r.order_id, user_id: r.user_id });
            }
            const cartResult = await cartRepositoryServiceIns.deleteCart(r.cart_id);
        }
        // console.log('---------------------DELETED PENDING ORDERS---------------------')
        return result;
    }

}

export const orderFailureRepositoryServiceIns = new OrderFailureRepositoryService(orderFailureRepositoryIns);
