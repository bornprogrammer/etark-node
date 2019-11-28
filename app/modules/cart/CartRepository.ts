import { ChainingMethodParamsEntity } from '@app/method-handler/ChainingMethodParamsEntity';
import { repositoryMethodHandlerIns } from '@app/method-handler/RepositoryMethodHandler';
import BaseRepository from '@app/repositories/BaseRepository';
import { cartModelIns } from './CartModel';

export class CartRepository extends BaseRepository {

    constructor() {
        super();
    }

    public addCart = async (chainingMethodParamsEntityObj: ChainingMethodParamsEntity) => {
        const topParams = chainingMethodParamsEntityObj.getTopParams();
        const result = await repositoryMethodHandlerIns.setParams(topParams).setMethodHandler(cartModelIns.addCart).get();
        return result;
    }

    public getItemAvailability = async (itemId) => {
        const result = await repositoryMethodHandlerIns.setParams(itemId).setMethodHandler(cartModelIns.getItemAvailability).get();
        return result;
    }

    public addCartItems = async (chainingMethodParamsEntityObj: ChainingMethodParamsEntity) => {
        const cartsParams = { cart_id: chainingMethodParamsEntityObj.getPreservedResultsContainerByIndex(0), cart_items: chainingMethodParamsEntityObj.getTopParams().cart_items };
        const result = await repositoryMethodHandlerIns.setParams(cartsParams).setMethodHandler(cartModelIns.addCartItems).get();
        this.addCartItemConsumption(cartsParams.cart_items);
    }

    public addOrder = async (chainingMethodParamsEntityObj: ChainingMethodParamsEntity) => {
        const results = await repositoryMethodHandlerIns.setParams(chainingMethodParamsEntityObj.getPreservedResultsContainerByIndex(0)).setMethodHandler(cartModelIns.addOrder).get();
        return results;
    }

    // public logCashfreeResponse = async (orderTxnId) => {
    //     const result = await repositoryMethodHandlerIns.setMethodHandler(cartModelIns.logCashfreeResponse).setParams(orderTxnId).get();
    //     return result;
    // }

    public deleteCartItems = async (orderId) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(cartModelIns.deleteCartItems).setParams(orderId).get();
        return result;
    }

    private addCartItemConsumption = async (cartItems) => {
        const results = await repositoryMethodHandlerIns.setParams(cartItems[0]).setMethodHandler(cartModelIns.addCartItemConsumption).get();
        return results;
    }

}

export const cartRepositoryIns = new CartRepository();
