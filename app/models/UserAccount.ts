import { sequelize } from '@app/config/Sequelize';
import IUserAccount from '@app/interfaces/models/IUserAccount';
import Logger from '@app/services/Logger';
import * as Sequelize from 'sequelize';

interface IUserAccountInstance extends Sequelize.Instance<IUserAccount>, IUserAccount {}

export const UserAccount = sequelize.define<IUserAccountInstance, IUserAccount>(
    'v2_user_accounts',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {type: Sequelize.INTEGER, field: 'user_id'},
        overallEarnedAmount: {
            type: Sequelize.DECIMAL(10, 2),
            field: 'overall_earned_amount',
            set(val) {
                this.setDataValue('overallEarnedAmount', Number(val).toFixed(2));
            },
        },
        incurredPkPlanCharge: {
            type: Sequelize.DECIMAL(10, 2),
            field: 'incurred_pk_plan_charge',
            set(val) {
                this.setDataValue('incurredPkPlanCharge', Number(val).toFixed(2));
            },
        },
        incurredPkGatewayCharge: {
            type: Sequelize.DECIMAL(10, 2),
            field: 'incurred_pk_gateway_charge',
            set(val) {
                this.setDataValue('incurredPkGatewayCharge', Number(val).toFixed(2));
            },
        },
        incurredServiceCharge: {
            type: Sequelize.DECIMAL(10, 2),
            field: 'incurred_service_charge',
            set(val) {
                this.setDataValue('incurredServiceCharge', Number(val).toFixed(2));
            },
        },
        incurredOverallCharge: {
            type: Sequelize.VIRTUAL,
            get() {
                return ( Number(this.get('incurredPkPlanCharge')) +
                        Number(this.get('incurredPkGatewayCharge')) +
                        Number(this.get('incurredServiceCharge'))
                ).toFixed(2);
            },
        },
        paidOverallCharge: {
            type: Sequelize.DECIMAL(10, 2),
            field: 'paid_overall_charge',
            set(val) {
                this.setDataValue('paidOverallCharge', Number(val).toFixed(2));
            },
        },
        pendingOverallCharge: {
            type: Sequelize.VIRTUAL,
            get() {
                return (
                    Number(this.get('incurredOverallCharge')) -
                    Number(this.get('paidOverallCharge'))
                ).toFixed(2);
            },
        },
        savedServiceCharge: {
            type: Sequelize.DECIMAL(10, 2),
            field: 'saved_service_charge',
            set(val) {
                this.setDataValue('savedServiceCharge', Number(val).toFixed(2));
            },
        },
        onlineOrdersAmount: {
            type: Sequelize.DECIMAL(10, 2),
            field: 'online_orders_amount',
            set(val) {
                this.setDataValue('onlineOrdersAmount', Number(val).toFixed(2));
            },
        },
        receivedOnlineOrdersAmount: {
            type: Sequelize.DECIMAL(10, 2),
            field: 'received_online_orders_amount',
            set(val) {
                this.setDataValue('receivedOnlineOrdersAmount', Number(val).toFixed(2));
            },
        },
        pendingOnlineOrdersAmount: {
            type: Sequelize.VIRTUAL,
            get() {
                return (
                    this.get('onlineOrdersAmount') - this.get('receivedOnlineOrdersAmount')
                ).toFixed(2);
            },
        },
        pkOnlineOrdersAmount: {
            type: Sequelize.DECIMAL(10, 2),
            field: 'pk_online_orders_amount',
            set(val) {
                this.setDataValue('pkOnlineOrdersAmount', Number(val).toFixed(2));
            },
        },
        pkOnlineOrdersCount: {
            type: Sequelize.INTEGER,
            field: 'pk_online_orders_count',
            set(val) {
                this.setDataValue('pkOnlineOrdersCount', Number(val));
            },
        },
        pkPlans: {
            type: Sequelize.JSON,
            field: 'pk_plans',
            get() {
                if (this.getDataValue('pkPlans')) {
                    return JSON.parse(this.getDataValue('pkPlans'));
                } else {
                    return [];
                }
            },
        },
        paidOverAllByCredits: {
            type: Sequelize.DECIMAL(10, 2),
            field: 'paid_overall_by_credits',
            set(val) {
                this.setDataValue('paidOverAllByCredits', Number(val).toFixed(2));
            },
        },
        paidOverAllRegular: {
            type: Sequelize.VIRTUAL,
            get() {
                return (
                    Number(
                        Number(this.get('paidOverallCharge')) -
                        Number(this.get('paidOverAllByCredits')),
                    ).toFixed(2)
                );
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
    {
        tableName: 'v2_user_accounts',
    },
);

export default UserAccount;
