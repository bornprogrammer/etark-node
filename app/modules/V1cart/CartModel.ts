import { sequelize } from '@app/config/Sequelize';
import { OrderStatusEnum } from '@app/enums/OrderStatusEnum';
import { PaymentModeEnum } from '@app/enums/PaymentModeEnum';
import ExpectationFailedError from '@app/errors/ExpectationFailedError';
import { Sequelize } from 'sequelize';
import { CryptoHelper } from '../helper/CryptoHelper';

export class CartModel {
    private sequelizeCon: Sequelize;
    constructor() {
        this.sequelizeCon = sequelize;
    }

    /**
     * saving the data to car_v1 table
     */
    public addCart = async (carts) => {
        try {
            const query = `INSERT into cart_v1 (cart_value,user_id,discount,is_enable,created_at,updated_at,grand_total) VALUES(${carts.cart_value},${carts.user_id},0,1,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,${carts.cart_value})`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public updateCart = async (carts) => {
        try {
            const query = `update cart_v1 set cart_value=${carts.cart_value},grand_total=${carts.cart_value} where id=${carts.cart_id} and is_enable=1 and user_id=${carts.user_id}`;
            const result = await this.sequelizeCon.query(query);
            if (result[0].affectedRows > 0) {
                const result1 = await this.deleteCartItems(carts.cart_id);
                const result2 = await this.increaseRemainingAvailability(this.getCartItemsDetailsByCartId(carts.cart_id));
                const result3 = await this.addCartItems(carts);
                return result[0];
            }
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public getItemAvailability = async (itemIds) => {
        try {
            const query = `select remaining_availability,total_availability,id as item_id from items where id in (${itemIds}) and is_enabled=1 and is_deleted=0`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    /**
     * its a bulk insert
     */
    public addCartItems = async (cartItems) => {
        try {
            const query = 'INSERT into cart_item (cart_id,item_id,ordered_unit,unit_price,discount,item_lookup_id,delivery_start,delivery_end)';
            const valueStr = await this.buildMultipleInsertCartItemsParams(cartItems.cart_id, cartItems.cart_items);
            const result = await this.sequelizeCon.query(query + valueStr);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public updateItemRemainingAvailability = async (cartItems) => {
        if (cartItems) {
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < cartItems.length; i++) {
                const query = `update items set remaining_availability=remaining_availability - ${cartItems[i].item_quantity},updated_at=CURRENT_TIMESTAMP where id=${cartItems[i].item_id} and is_enabled=1 and is_deleted=0`;
                this.sequelizeCon.query(query);
            }
        }
    }

    // public logCashfreeResponse = async (orderParams) => {
    //     try {
    //         const orderQuery = `select id as order_id from order_v1 where order_transaction_id='${orderParams.order_transaction_id}' and status='${OrderStatusEnum.PENDING}' order by id desc limit 1`;
    //         const orderResult = await this.sequelizeCon.query(orderQuery);
    //         const orderId = orderResult[0].length > 0 ? orderResult[0][0].order_id : null;
    //         if (orderId) {
    //             const updateOrderPayment = `update order_v1 set status='${OrderStatusEnum.COMPLETED}',updated_at=CURRENT_TIMESTAMP where id=${orderId}`;
    //             const updateOrderPaymentResult = await this.sequelizeCon.query(updateOrderPayment);
    //             const query = `INSERT into order_payment_gateway_response_log (order_id,payment_gateway_response,payment_gateway_type,created_at,updated_at) values (${orderId},'${orderParams.payment_gateway_response}','${PaymentModeEnum.CASHFREE}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`;
    //             const result = await this.sequelizeCon.query(query);
    //             return result[0];
    //         }
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    public deleteCart = async (cartId) => {
        try {
            // if (cartId) {
            const removeCartQuery = `update cart_v1 set is_enable=0,updated_at=CURRENT_TIMESTAMP where id=${cartId}`;
            const removeCartQueryExe = await this.sequelizeCon.query(removeCartQuery);

            const orderedUnits = await this.getCartItemsDetailsByCartId(cartId);

            this.deleteCartItems(cartId);
            this.increaseRemainingAvailability(orderedUnits);
            return removeCartQueryExe;
            // }
        } catch (error) {
            throw error;
        }
    }

    private getCartItemsDetailsByCartId = async (cartId) => {
        const itemDetailsQuery = `select ordered_unit as item_quantity,item_id from cart_item where cart_id=${cartId} and is_enabled=1 and is_deleted=0`;
        const itemDetailsQueryExe = await this.sequelizeCon.query(itemDetailsQuery);
        return itemDetailsQueryExe[0].length > 0 ? itemDetailsQueryExe[0] : null;
    }

    private increaseRemainingAvailability = async (cartItemDetails) => {
        // tslint:disable-next-line: prefer-for-of
        if (cartItemDetails) {
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < cartItemDetails.length; i++) {
                const query = `update items set remaining_availability=remaining_availability + ${cartItemDetails[i].item_quantity},updated_at=CURRENT_TIMESTAMP where id=${cartItemDetails[i].item_id} and is_enabled=1 and is_deleted=0`;
                this.sequelizeCon.query(query);
            }
        }
    }

    private deleteCartItems = async (cartId) => {
        const removeCartItemQuery = `update cart_item set is_enabled=0,is_deleted=1,deleted_at=CURRENT_TIMESTAMP where cart_id=${cartId}`;
        const removeCartItemQueryExe = await this.sequelizeCon.query(removeCartItemQuery);
        return removeCartItemQueryExe;
    }
    /**
     *
     */
    private buildMultipleInsertCartItemsParams = async (cartId, cartItems) => {
        let multipleInsertCartItemsParamsString = ' VALUES ';
        cartItems.forEach(async (item) => {
            multipleInsertCartItemsParamsString += `(${cartId},${item.item_id},${item.item_quantity},${item.unit_price},${item.discount || 0},${item.item_lookup_id},'${item.delivery_start}','${item.delivery_end}'),`;
        });
        return multipleInsertCartItemsParamsString.substring(0, multipleInsertCartItemsParamsString.length - 1);
    }

    private buildMultipleInsertCartItemsConsumptionParams = async (cartItems) => {
        let multipleInsertCartItemsConsumptionParams = ' VALUES ';

        cartItems.forEach(async (item) => {
            multipleInsertCartItemsConsumptionParams += `('items',${item.item_id},${item.item_quantity},0,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),`;
        });
        return multipleInsertCartItemsConsumptionParams.substring(0, multipleInsertCartItemsConsumptionParams.length - 1);
    }
}

export const cartModelIns = new CartModel();
