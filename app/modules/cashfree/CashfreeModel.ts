import { sequelize } from '@app/config/Sequelize';
import { OrderStatusEnum } from '@app/enums/OrderStatusEnum';
import { PaymentModeEnum } from '@app/enums/PaymentModeEnum';
import { Sequelize } from 'sequelize';

class CashfreeModel {
    private sequelizeCon: Sequelize;
    constructor() {
        this.sequelizeCon = sequelize;
    }

    public logCashfreeResponse = async (orderParams) => {
        try {
            const orderQuery = `select id as order_id from order_v1 where order_transaction_id = '${orderParams.order_transaction_id}' and status = '${OrderStatusEnum.PENDING}' order by id desc limit 1`;
            const orderResult = await this.sequelizeCon.query(orderQuery);
            const orderId = orderResult[0].length > 0 ? orderResult[0][0].order_id : null;
            if (orderId) {
                const updateOrderPayment = `update order_v1 set status = '${orderParams.status}', updated_at = CURRENT_TIMESTAMP where id = ${orderId} `;
                const updateOrderPaymentResult = await this.sequelizeCon.query(updateOrderPayment);
                const query = `INSERT into order_payment_gateway_response_log(order_id, payment_gateway_response, payment_gateway_type, created_at, updated_at) values(${orderId}, '${orderParams.payment_gateway_response}', '${PaymentModeEnum.CASHFREE}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
                const result = await this.sequelizeCon.query(query);

                const pendingOrderByOrderTranxnId = `SELECT cart_id from order_v1 where order_transaction_id = '${orderParams.order_transaction_id}' order by id desc limit 1`;

                const pendingOrderByOrderTranxnIdResult = await this.sequelizeCon.query(pendingOrderByOrderTranxnId);
                const cartId = pendingOrderByOrderTranxnIdResult[0].length > 0 ? pendingOrderByOrderTranxnIdResult[0][0].cart_id : null;
                if (cartId) {
                    const updatePendingOrder = `UPDATE order_v1 set status = '${OrderStatusEnum.FAILURE}', updated_at = CURRENT_TIMESTAMP where cart_id = ${cartId} and status = '${OrderStatusEnum.PENDING}'`;
                    this.sequelizeCon.query(updatePendingOrder);
                }
                return result[0];
            }
        } catch (error) {
            throw error;
        }
    }
}

export const cashfreeModelIns = new CashfreeModel();
