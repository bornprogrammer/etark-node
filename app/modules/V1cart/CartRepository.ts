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

    public updateCart = async (chainingMethodParamsEntityObj: ChainingMethodParamsEntity) => {
        const topParams = chainingMethodParamsEntityObj.getTopParams();
        const result = await repositoryMethodHandlerIns.setParams(topParams).setMethodHandler(cartModelIns.updateCart).get();
        return result;
    }

    public getItemAvailability = async (itemId) => {
        const result = await repositoryMethodHandlerIns.setParams(itemId).setMethodHandler(cartModelIns.getItemAvailability).get();
        return result;
    }

    public addCartItems = async (chainingMethodParamsEntityObj: ChainingMethodParamsEntity) => {
        const cartsParams = { cart_id: chainingMethodParamsEntityObj.getPreservedResultsContainerByIndex(0), cart_items: chainingMethodParamsEntityObj.getTopParams().cart_items };
        const result = await repositoryMethodHandlerIns.setParams(cartsParams).setMethodHandler(cartModelIns.addCartItems).get();
        // this.addCartItemConsumption(cartsParams.cart_items);
        this.updateItemRemainingAvailability(cartsParams.cart_items);
    }

    // public logCashfreeResponse = async (orderTxnId) => {
    //     const result = await repositoryMethodHandlerIns.setMethodHandler(cartModelIns.logCashfreeResponse).setParams(orderTxnId).get();
    //     return result;
    // }

    public deleteCart = async (cartId) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(cartModelIns.deleteCart).setParams(cartId).get();
        return result;
    }

    // public addCartItemConsumption = async (cartItems) => {
    //     const results = await repositoryMethodHandlerIns.setParams(cartItems).setMethodHandler(cartModelIns.addCartItemConsumption).get();
    //     return results;
    // }

    public updateItemRemainingAvailability = async (cartItems) => {
        const results = await repositoryMethodHandlerIns.setParams(cartItems).setMethodHandler(cartModelIns.updateItemRemainingAvailability).get();
        return results;
    }

}

export const cartRepositoryIns = new CartRepository();
