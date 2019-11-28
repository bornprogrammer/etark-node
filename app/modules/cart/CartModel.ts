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

    public getItemAvailability = async (itemId) => {
        try {
            const query = `select remaining_availability,total_availability from items where id=${itemId} and is_enabled=1 and is_deleted=0`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0][0] : null;
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

    public addCartItemConsumption = async (cartItems) => {
        try {
            // tslint:disable-next-line: max-line-length
            const query = `INSERT into cart_items_consumption (origin,origin_id,consumed_cnt,is_deleted,created_at,updated_at) values ('items',${cartItems.item_id},${cartItems.item_quantity},0,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`;
            const result = await this.sequelizeCon.query(query);
            const itemAvailability = await this.getItemAvailability(cartItems.item_id);
            console.log(itemAvailability);
            if (itemAvailability) {
                const remainingAvailability = itemAvailability.remaining_availability - cartItems.item_quantity;
                const result1 = await this.sequelizeCon.query(`update items set remaining_availability=${remainingAvailability},updated_at=CURRENT_TIMESTAMP where id=${cartItems.item_id} and is_enabled=1 and is_deleted=0`);
            }
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public addOrder = async (cartId) => {
        try {
            const orderTxnId = 'CART' + CryptoHelper.randomValueHex(14);
            const query = `INSERT into order_v1 (cart_id,status,payment_mode,order_transaction_id,created_at,updated_at) values (${cartId},'${OrderStatusEnum.PENDING}','${PaymentModeEnum.CASHFREE}','${orderTxnId}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`;
            const result = await this.sequelizeCon.query(query);
            return { orderTxnId, orderId: result[0] };
        } catch (error) {
            throw error;
        }
    }

    public logCashfreeResponse = async (orderParams) => {
        try {
            const orderQuery = `select id as order_id from order_v1 where order_transaction_id='${orderParams.order_transaction_id}' and status='${OrderStatusEnum.PENDING}' order by id desc limit 1`;
            const orderResult = await this.sequelizeCon.query(orderQuery);
            const orderId = orderResult[0].length > 0 ? orderResult[0][0].order_id : null;
            if (orderId) {
                const updateOrderPayment = `update order_v1 set status='${orderParams.status}',updated_at=CURRENT_TIMESTAMP where id=${orderId}`;
                const updateOrderPaymentResult = await this.sequelizeCon.query(updateOrderPayment);
                const query = `INSERT into order_payment_gateway_response_log (order_id,payment_gateway_response,payment_gateway_type,created_at,updated_at) values (${orderId},'${orderParams.payment_gateway_response}','${PaymentModeEnum.CASHFREE}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`;
                const result = await this.sequelizeCon.query(query);
                return result[0];
            }
        } catch (error) {
            throw error;
        }
    }

    public deleteCartItems = async (orderId) => {
        try {
            const cartDetailsQuery = `select cart_id from order_v1 where id=${orderId}`;
            const cartDetails = await this.sequelizeCon.query(cartDetailsQuery);
            const cartId = cartDetails[0].length > 0 ? cartDetails[0][0].cart_id : null;
            if (cartId) {

                const cancelOrderQuery = `update order_v1 set status='${OrderStatusEnum.CANCELLED}',updated_at=CURRENT_TIMESTAMP where id=${orderId}`;
                const cancelOrderQueryExe = await this.sequelizeCon.query(cancelOrderQuery);

                const removeCartItemQuery = `update cart_v1 set is_enable=0,updated_at=CURRENT_TIMESTAMP where id=${cartId}`;
                const removeCartItemQueryExe = await this.sequelizeCon.query(removeCartItemQuery);

                const orderedUnitsQuery = `select ordered_unit,item_id from cart_item where cart_id=${cartId}`;
                const orderedUnitsQueryExe = await this.sequelizeCon.query(orderedUnitsQuery);
                const orderedUnits = orderedUnitsQueryExe[0].length > 0 ? orderedUnitsQueryExe[0][0].ordered_unit : 0;

                if (orderedUnits > 0) {
                    const increaseRemainingAvb = `update items set remaining_availability=remaining_availability+${orderedUnits} where id=${orderedUnitsQueryExe[0][0].item_id}`;
                    const increaseRemainingAvbExe = await this.sequelizeCon.query(increaseRemainingAvb);
                }
            }
        } catch (error) {
            throw error;
        }
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
}

export const cartModelIns = new CartModel();
