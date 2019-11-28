import { sequelize } from '@app/config/Sequelize';
import IOrder from '@app/interfaces/models/IOrder';
import * as Sequelize from 'sequelize';

interface IOrderInstance extends Sequelize.Instance<IOrder>, IOrder {}

const Order = sequelize.define<IOrderInstance, IOrder>(
    'orders',
    {
        id: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        foodyId: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
        },
        addressType: {
            type: Sequelize.ENUM('pick_up', 'home_delivery'),
            allowNull: false,
            field: 'addressType',
        },
        addressId: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            field: 'address_id',
        },
        hubId: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            field: 'hub_id',
        },
        dishId: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            field: 'dish_id',
        },
        postedDishId: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            field: 'posted_dish_id',
        },
        deviceId: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            field: 'device_id',
        },
        orderedUnits: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            field: 'ordered_units',
        },
        totalCost: {
            type: Sequelize.DECIMAL,
            allowNull: false,
            field: 'total_cost',
        },
        totalServiceCharge: {
            type: Sequelize.DECIMAL,
            allowNull: false,
            field: 'total_service_charge',
            get() {
                return Number(this.getDataValue('totalServiceCharge')).toFixed(2);
            },
        },
        deliveryStartTime: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'delivery_start_time',
        },
        deliveryCharge: {
            type: Sequelize.DECIMAL,
            allowNull: false,
            field: 'delivery_charge',
        },
        netAmount: {
            type: Sequelize.DECIMAL,
            allowNull: false,
            field: 'net_amount',
        },
        suggestion: {
            type: Sequelize.TEXT,
            allowNull: false,
            field: 'suggestion',
        },
        orderStatus: {
            type: Sequelize.ENUM(
                'pending',
                'confirmed',
                'cancelled',
                'completed',
                'in_process',
                'failure',
                'payment_not_initiated',
                'request_sent',
                'request_confirmed',
                'request_rejected',
                'request_expired',
                'request_cancelled',
            ),
            allowNull: false,
            defaultValue: 'payment_not_initiated',
            field: 'order_status',
        },
        paymentType: {
            type: Sequelize.ENUM(
                'CASH_ON_DLY',
                'PAYTM',
                'CASHFREE',
                'WALLET',
                'WALLET_AND_CASH',
                'WALLET_AND_PAYTM',
                'WALLET_AND_CASHFREE',
            ),
            allowNull: false,
            field: 'payment_type',
        },
        refundStatus: {
            type: Sequelize.ENUM(
                'none',
                'pending',
                'in_process',
                'refunded',
                'failure',
                'refunded_to_wallet',
                'partial_refund',
            ),
            allowNull: false,
            defaultValue: 'none',
            field: 'refund_status',
        },
        respondedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'responded_at',
        },
        completedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'completed_at',
        },
        deliveryTime: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'delivery_time',
        },
        deliveryChargeId: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            field: 'delivery_charge_id',
        },
        gstCharge: {
            type: Sequelize.FLOAT,
            allowNull: false,
            field: 'gst_charge',
        },
        isRequest: {
            type: Sequelize.INTEGER(1),
            allowNull: false,
            field: 'is_request',
        },
        walletAmount: {
            type: Sequelize.DECIMAL,
            allowNull: false,
            field: 'wallet_amount',
        },
        isSchedular: {
            type: Sequelize.INTEGER(4),
            allowNull: false,
            field: 'is_schedular',
        },
        promotionsWalletAmount: {
            type: Sequelize.DECIMAL,
            allowNull: true,
            field: 'promotions_wallet_amount',
        },
        regularWalletAmount: {
            type: Sequelize.DECIMAL,
            allowNull: true,
            field: 'regular_wallet_amount',
        },
        orderStatusUpdatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'order_status_updated_at',
        },
        noteFromChef: {
            type: Sequelize.STRING(255),
            allowNull: false,
            field: 'note_from_chef',
        },
        privateKitchenHubId: {
            type: Sequelize.INTEGER(11),
            allowNull: true,
            field: 'private_kitchen_hub_id',
        },
        onlineTransactionCharges: {
            type: Sequelize.DECIMAL,
            allowNull: true,
            field: 'online_transaction_charges',
            get() {
                return this.getDataValue('onlineTransactionCharges') || '0.00';
            },
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'created_at',
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'updated_at',
        },
    },
);

Order.associate = (models) => {
    Order.belongsTo(models.Dish, { targetKey: 'id', foreignKey: 'dish_id' });
    Order.belongsTo(models.User, { targetKey: 'id', foreignKey: 'foody_id' });
};

export {Order};

export default Order;
