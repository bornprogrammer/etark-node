import { sequelize } from '@app/config/Sequelize';
import { OrderStatusEnum } from '@app/enums/OrderStatusEnum';
import { PaymentModeEnum } from '@app/enums/PaymentModeEnum';
import { Sequelize } from 'sequelize';
import { CryptoHelper } from '../helper/CryptoHelper';
// import { sequelize } from '@app/config/Sequelize';
// import IOrder from '@app/interfaces/models/IOrder';
// import * as Sequelize from '@app/modules/order/node_modules/sequelize';

// interface IOrderInstance extends Sequelize.Instance<IOrder>, IOrder {}

// const Order = sequelize.define<IOrderInstance, IOrder>(
//     'orders',
//     {
//         id: {
//             type: Sequelize.INTEGER(11),
//             allowNull: false,
//             primaryKey: true,
//             autoIncrement: true,
//         },
//         foodyId: {
//             type: Sequelize.INTEGER(11),
//             allowNull: false,
//         },
//         addressType: {
//             type: Sequelize.ENUM('pick_up', 'home_delivery'),
//             allowNull: false,
//             field: 'addressType',
//         },
//         addressId: {
//             type: Sequelize.INTEGER(11),
//             allowNull: false,
//             field: 'address_id',
//         },
//         hubId: {
//             type: Sequelize.INTEGER(11),
//             allowNull: false,
//             field: 'hub_id',
//         },
//         dishId: {
//             type: Sequelize.INTEGER(11),
//             allowNull: false,
//             field: 'dish_id',
//         },
//         postedDishId: {
//             type: Sequelize.INTEGER(11),
//             allowNull: false,
//             field: 'posted_dish_id',
//         },
//         deviceId: {
//             type: Sequelize.INTEGER(11),
//             allowNull: false,
//             field: 'device_id',
//         },
//         orderedUnits: {
//             type: Sequelize.INTEGER(11),
//             allowNull: false,
//             field: 'ordered_units',
//         },
//         totalCost: {
//             type: Sequelize.DECIMAL,
//             allowNull: false,
//             field: 'total_cost',
//         },
//         totalServiceCharge: {
//             type: Sequelize.DECIMAL,
//             allowNull: false,
//             field: 'total_service_charge',
//         },
//         deliveryStartTime: {
//             type: Sequelize.DATE,
//             allowNull: false,
//             field: 'delivery_start_time',
//         },
//         deliveryCharge: {
//             type: Sequelize.DECIMAL,
//             allowNull: false,
//             field: 'delivery_charge',
//         },
//         netAmount: {
//             type: Sequelize.DECIMAL,
//             allowNull: false,
//             field: 'net_amount',
//         },
//         suggestion: {
//             type: Sequelize.TEXT,
//             allowNull: false,
//             field: 'suggestion',
//         },
//         orderStatus: {
//             type: Sequelize.ENUM(
//                 'pending',
//                 'confirmed',
//                 'cancelled',
//                 'completed',
//                 'in_process',
//                 'failure',
//                 'payment_not_initiated',
//                 'request_sent',
//                 'request_confirmed',
//                 'request_rejected',
//                 'request_expired',
//                 'request_cancelled',
//             ),
//             allowNull: false,
//             defaultValue: 'payment_not_initiated',
//             field: 'order_status',
//         },
//         paymentType: {
//             type: Sequelize.ENUM(
//                 'CASH_ON_DLY',
//                 'PAYTM',
//                 'CASHFREE',
//                 'WALLET',
//                 'WALLET_AND_CASH',
//                 'WALLET_AND_PAYTM',
//                 'WALLET_AND_CASHFREE',
//             ),
//             allowNull: false,
//             field: 'payment_type',
//         },
//         refundStatus: {
//             type: Sequelize.ENUM(
//                 'none',
//                 'pending',
//                 'in_process',
//                 'refunded',
//                 'failure',
//                 'refunded_to_wallet',
//                 'partial_refund',
//             ),
//             allowNull: false,
//             defaultValue: 'none',
//             field: 'refund_status',
//         },
//         respondedAt: {
//             type: Sequelize.DATE,
//             allowNull: false,
//             field: 'responded_at',
//         },
//         completedAt: {
//             type: Sequelize.DATE,
//             allowNull: false,
//             field: 'completed_at',
//         },
//         deliveryTime: {
//             type: Sequelize.DATE,
//             allowNull: false,
//             field: 'delivery_time',
//         },
//         deliveryChargeId: {
//             type: Sequelize.INTEGER(11),
//             allowNull: false,
//             field: 'delivery_charge_id',
//         },
//         gstCharge: {
//             type: Sequelize.FLOAT,
//             allowNull: false,
//             field: 'gst_charge',
//         },
//         isRequest: {
//             type: Sequelize.INTEGER(1),
//             allowNull: false,
//             field: 'is_request',
//         },
//         walletAmount: {
//             type: Sequelize.DECIMAL,
//             allowNull: false,
//             field: 'wallet_amount',
//         },
//         isSchedular: {
//             type: Sequelize.INTEGER(4),
//             allowNull: false,
//             field: 'is_schedular',
//         },
//         promotionsWalletAmount: {
//             type: Sequelize.DECIMAL,
//             allowNull: true,
//             field: 'promotions_wallet_amount',
//         },
//         regularWalletAmount: {
//             type: Sequelize.DECIMAL,
//             allowNull: true,
//             field: 'regular_wallet_amount',
//         },
//         orderStatusUpdatedAt: {
//             type: Sequelize.DATE,
//             allowNull: false,
//             field: 'order_status_updated_at',
//         },
//         noteFromChef: {
//             type: Sequelize.STRING(255),
//             allowNull: false,
//             field: 'note_from_chef',
//         },
//         privateKitchenHubId: {
//             type: Sequelize.INTEGER(11),
//             allowNull: true,
//             field: 'private_kitchen_hub_id',
//         },
//         onlineTransactionCharges: {
//             type: Sequelize.DECIMAL,
//             allowNull: true,
//             field: 'online_transaction_charges',
//         },
//         createdAt: {
//             type: Sequelize.DATE,
//             allowNull: false,
//             field: 'created_at',
//         },
//         updatedAt: {
//             type: Sequelize.DATE,
//             allowNull: false,
//             field: 'updated_at',
//         },
//     },
// );

// export default Order;

export class OrderModel {

    private sequelizeCon: Sequelize;
    constructor() {
        this.sequelizeCon = sequelize;
    }

    public addOrder = async (params) => {
        try {
            const orderTxnId = 'CART' + CryptoHelper.randomValueHex(14);
            const query = `INSERT into order_v1 (cart_id,status,payment_mode,order_transaction_id,total_order_amount_paid,client,created_at,updated_at) values (${params.cart_id},'${params.orderStatus}','${params.paymentMode}','${orderTxnId}',${params.cart_value - params.deductBalance},'${params.type ? params.type : null}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`;
            const result = await this.sequelizeCon.query(query);
            return { orderTxnId, balance_amount_to_be_paid: params.cart_value - params.deductBalance, pay_online: (params.paymentMode === PaymentModeEnum.CASHFREE || params.paymentMode === PaymentModeEnum.WALLET_AND_CASHFREE) ? true : false, orderId: result[0] };
        } catch (error) {
            throw error;
        }

    }

    public deleteOrder = async (orderId) => {
        const cancelOrderQuery = `update order_v1 set status='${OrderStatusEnum.CANCELLED}',updated_at=CURRENT_TIMESTAMP where id=${orderId}`;
        const cancelOrderQueryExe = await this.sequelizeCon.query(cancelOrderQuery);
    }

    public getOrderInfoByOrderId = async (params) => {
        try {
            const query = `select i.title,u.name as buddy_name,ov.id as order_id,ci.ordered_unit,DATE_FORMAT((DATE_ADD(i.delivery_date,INTERVAL 4 DAY)),"%D %b %Y") as delivery_date,t.phone from order_v1 ov INNER JOIN cart_v1 cv on cv.id=ov.cart_id INNER JOIN cart_item ci on ci.cart_id=cv.id INNER JOIN items i on i.id=ci.item_id INNER JOIN users u on u.id=i.user_id INNER JOIN (select id,phone from users) as t on t.id=cv.user_id where ov.order_transaction_id="${params.orderTxnId}" and ov.status="completed" and ci.is_deleted=0 and ci.is_enabled=1`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public getWebOrderInfo = async (orderTxnId) => {
        try {
            const query = `select i.title,ov.id as order_id,ci.ordered_unit,ib.image as goodies_image,DATE_FORMAT((DATE_ADD(i.delivery_date,INTERVAL 4 DAY)),"%D %b, %Y") as delivery_date from order_v1 ov INNER JOIN cart_v1 cv on cv.id=ov.cart_id INNER JOIN cart_item ci on ci.cart_id=cv.id INNER JOIN items i on i.id=ci.item_id LEFT JOIN item_banner ib on ib.item_id=i.id where ov.order_transaction_id="${orderTxnId}" and ov.status in ("completed","confirmed") and ci.is_deleted=0 and ci.is_enabled=1`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            throw error;
        }
    }
}

export const orderModelIns = new OrderModel();
