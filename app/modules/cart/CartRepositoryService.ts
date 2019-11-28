import { cfServiceIns } from '@app/cashfree/CFService';
import { CartItemTypeEnum } from '@app/enums/CartItemTypeEnum';
// tslint:disable-next-line: ordered-imports
import { OrderStatusEnum } from '@app/enums/OrderStatusEnum';
import ExpectationFailedError from '@app/errors/ExpectationFailedError';
import { chainingMethodHandlerIns } from '@app/method-handler/ChainingMethodHandler';
import { ChainingMethodParamsEntity } from '@app/method-handler/ChainingMethodParamsEntity';
import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import BaseRepositoryService from '@app/services/BaseRepositoryService';
import { shippingRepositoryServiceIns } from '../shipping/ShippingRepositoryService';
import { CartRepository, cartRepositoryIns } from './CartRepository';

export class CartRepositoryService extends BaseRepositoryService {

    constructor(cartRepository: CartRepository) {
        super(cartRepository);
    }

    public addCart = async (carts) => {
        const data = await chainingMethodHandlerIns().setNextMethodHandler(this.isCartItemAvailable, carts).setNextMethodHandlerNPreserveResult(this.mRepository.addCart, carts).setNextMethodHandler(this.mRepository.addCartItems).setNextMethodHandlerNPreserveResult(this.mRepository.addOrder).setNextMethodHandler(this.addAddress).get();
        const result = data[1];
        // if (carts.type === 'ios') {
        //     const payload = { orderId: result.orderTxnId, orderAmount: carts.cart_value, orderCurrency: 'INR' };
        //     const token = await cfTokenGeneratorServiceIns.generate(payload);
        //     result.cftoken = token;
        // }
        return result;
    }

    public deleteCartItems = async (orderId) => {
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.deleteCartItems).setParams(orderId).get();
        return result;
    }

    public isCartItemAvailable = async (chainingMethodParamsEntityObj: ChainingMethodParamsEntity) => {
        const topParams = chainingMethodParamsEntityObj.getTopParams();
        const itemAvailability = await this.mRepository.getItemAvailability(topParams.cart_items[0].item_id);
        if (itemAvailability === null || itemAvailability.remaining_availability < topParams.cart_items[0].item_quantity) {
            throw new ExpectationFailedError('Item not available');
        }
        return true;
    }

    public addAddress = async (chainingMethodParamsEntityObj: ChainingMethodParamsEntity) => {
        let addressResult = null;
        const topParams = chainingMethodParamsEntityObj.getTopParams();
        const shippingAddress = topParams.shipping_address;
        shippingAddress.order_id = chainingMethodParamsEntityObj.getPreservedResultsContainerByIndex(1).orderId;
        if (topParams.cart_items[0].item_type === CartItemTypeEnum.COOKING_CLASSES) {
            addressResult = await this.addEAddress(shippingAddress);
        } else {
            shippingAddress.user_id = topParams.user_id;
            addressResult = await this.addShippingAddress(shippingAddress);
        }
    }

    public addShippingAddress = async (shippingAddress) => {
        const shippingAddressResult = await shippingRepositoryServiceIns.addShippingAddress(shippingAddress);
        return shippingAddressResult;
    }

    public addEAddress = async (eAddress) => {
        const eAddressResult = await shippingRepositoryServiceIns.addEAddress(eAddress);
        return eAddressResult;
    }

    // public logCashfreeResponse = async (orderParams) => {
    //     const params = { order_transaction_id: orderParams.orderId, status: orderParams.txStatus === 'SUCCESS' ? OrderStatusEnum.COMPLETED : OrderStatusEnum.FAILURE, reference_id: orderParams.referenceId, txn_status: orderParams.txStatus, response_msg: orderParams.txMsg, payment_gateway_response: JSON.stringify(orderParams) };
    //     const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.logCashfreeResponse).setParams(params).get();
    //     return result;
    // }
}

export const cartRepositoryServiceIns = new CartRepositoryService(cartRepositoryIns);
