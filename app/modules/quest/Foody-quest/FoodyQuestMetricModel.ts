import { sequelize } from '@app/config/Sequelize';
import { PaymentModeEnum } from '@app/enums/PaymentModeEnum';
import { Sequelize } from 'sequelize';
class FoodyQuestMetricModel {
    private sequelizeCon: Sequelize;
    constructor() {
        this.sequelizeCon = sequelize;
    }

    public orderOnUniqueDays = async (params) => {
        try {
            const query = `select count(DISTINCT(date(delivery_time))) as unique_days_order_cnt from orders
            where foody_id=${params.foody_id} and
            order_status in ('request_confirmed','completed','confirmed')
            and date(orders.created_at) BETWEEN '${params.from_date}' and '${params.to_date}' and orders.payment_type in ('${PaymentModeEnum.CASHFREE}','${PaymentModeEnum.PAYTM}','${PaymentModeEnum.WALLET}','${PaymentModeEnum.WALLET_AND_PAYTM}','${PaymentModeEnum.WALLET_AND_CASHFREE}')`;
            const result = await this.sequelizeCon.query(query);
            // tslint:disable-next-line: no-string-literal
            return result[0][0]['unique_days_order_cnt'];
        } catch (error) {
            throw error;
        }
    }

    public getMealsPurchased = async (params) => {
        try {
            const query = `select sum(net_amount) as ordered_amount from orders
            where foody_id=${params.foody_id} and
            order_status in ('request_confirmed','completed','confirmed')
            and date(orders.created_at) BETWEEN '${params.from_date}' and '${params.to_date}' and orders.payment_type in ('${PaymentModeEnum.CASHFREE}','${PaymentModeEnum.PAYTM}','${PaymentModeEnum.WALLET}','${PaymentModeEnum.WALLET_AND_PAYTM}','${PaymentModeEnum.WALLET_AND_CASHFREE}')`;
            const result = await this.sequelizeCon.query(query);
            // tslint:disable-next-line: no-string-literal
            return result[0][0]['ordered_amount'];
        } catch (error) {
            throw error;
        }
    }

    public orderFromUniqueChefs = async (params) => {
        try {
            // tslint:disable-next-line: max-line-length
            const query = `select count(DISTINCT(buddy_id)) unique_chefs_order_cnt from orders
            inner join dishes on dishes.id=orders.dish_id
            where foody_id=${params.foody_id} and
            order_status in ('request_confirmed','completed','confirmed')
            and date(orders.created_at) BETWEEN '${params.from_date}' and '${params.to_date}' and orders.payment_type in ('${PaymentModeEnum.CASHFREE}','${PaymentModeEnum.PAYTM}','${PaymentModeEnum.WALLET}','${PaymentModeEnum.WALLET_AND_PAYTM}','${PaymentModeEnum.WALLET_AND_CASHFREE}')`;
            const result = await this.sequelizeCon.query(query);
            // tslint:disable-next-line: no-string-literal
            return result[0][0]['unique_chefs_order_cnt'];
        } catch (error) {
            throw error;
        }
    }

    public getUniqueCuratedGoodiesPurchased = async (params) => {
        try {
            // tslint:disable-next-line: max-line-length
            const query = `SELECT count(DISTINCT cart_item.item_id) as unique_curated_goodies_purchase_count
        from cart_v1 inner join cart_item on cart_v1.id = cart_item.cart_id inner join order_v1 on cart_v1.id = order_v1.cart_id where cart_v1.user_id = ${params.foody_id} and cart_v1.is_enable = 1 and cart_item.is_enabled = 1
            and cart_item.is_deleted = 0 and DATE(CONVERT_TZ(order_v1.created_at,'+00:00','+05:30')) between '${params.from_date}' and '${params.to_date}'
            and order_v1.status in ('confirmed','completed') and order_v1.payment_mode in ('${PaymentModeEnum.CASHFREE}','${PaymentModeEnum.PAYTM}','${PaymentModeEnum.WALLET}','${PaymentModeEnum.WALLET_AND_PAYTM}','${PaymentModeEnum.WALLET_AND_CASHFREE}')`;
            const result = await this.sequelizeCon.query(query);
            // tslint:disable-next-line: no-string-literal
            return result[0][0]['unique_curated_goodies_purchase_count'];
        } catch (error) {
            throw error;
        }
    }
}

export const foodyQuestMetricModelIns = new FoodyQuestMetricModel();
