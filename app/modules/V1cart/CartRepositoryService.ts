import { OrderStatusEnum } from '@app/enums/OrderStatusEnum';
import ExpectationFailedError from '@app/errors/ExpectationFailedError';
import { chainingMethodHandlerIns } from '@app/method-handler/ChainingMethodHandler';
import { ChainingMethodParamsEntity } from '@app/method-handler/ChainingMethodParamsEntity';
import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import BaseRepositoryService from '@app/services/BaseRepositoryService';
import { inputHelperIns } from '../helper/InputHelper';
import { CartRepository, cartRepositoryIns } from './CartRepository';

export class CartRepositoryService extends BaseRepositoryService {

    constructor(cartRepository: CartRepository) {
        super(cartRepository);
    }

    public addCart = async (carts) => {
        const data = await chainingMethodHandlerIns().setNextMethodHandler(this.isCartItemAvailable, carts).setNextMethodHandlerNPreserveResult(this.mRepository.addCart, carts).setNextMethodHandler(this.mRepository.addCartItems).get();
        return { cart_id: data[0] };
    }

    public deleteCart = async (cartId) => {
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.deleteCart).setParams(cartId).get();
        return result;
    }

    public isCartItemAvailable = async (chainingMethodParamsEntityObj: ChainingMethodParamsEntity) => {
        const topParams = chainingMethodParamsEntityObj.getTopParams();
        if (topParams.cart_items) {
            let itemIds = '';
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < topParams.cart_items.length; i++) {
                itemIds += topParams.cart_items[i].item_id + ',';
            }
            itemIds = itemIds.substr(0, itemIds.length - 1);
            const itemAvailability = await this.mRepository.getItemAvailability(itemIds);
            if (!inputHelperIns.isInputValid(itemAvailability)) {
                throw new ExpectationFailedError('Item not available');
            } else {
                itemAvailability.forEach((item, ind) => {

                    if (item.remaining_availability < topParams.cart_items[ind].item_quantity) {
                        throw new ExpectationFailedError('Item not available');
                    }
                });
            }
        }
        return true;
    }

    public updateCart = async (carts) => {
        const data = await chainingMethodHandlerIns().setNextMethodHandler(this.isCartItemAvailable, carts).setNextMethodHandler(this.mRepository.updateCart).get();
        let result = null;
        if (inputHelperIns.isInputValid(data[0])) {
            result = { cart_id: data[0] };
        }
        return result;
    }

    // public logCashfreeResponse = async (orderParams) => {
    //     const params = { order_transaction_id: orderParams.orderId, status: orderParams.txStatus === 'SUCCESS' ? OrderStatusEnum.COMPLETED : OrderStatusEnum.FAILURE, reference_id: orderParams.referenceId, txn_status: orderParams.txStatus, response_msg: orderParams.txMsg, payment_gateway_response: JSON.stringify(orderParams) };
    //     const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.logCashfreeResponse).setParams(params).get();
    //     return result;
    // }
}

export const cartRepositoryServiceIns = new CartRepositoryService(cartRepositoryIns);
