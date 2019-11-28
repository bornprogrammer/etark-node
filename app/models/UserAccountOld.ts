import { sequelize } from '@app/config/Sequelize';
import IUserAccountOld from '@app/interfaces/models/IUserAccountOld';
import * as Sequelize from 'sequelize';

interface IUserAccountOldInstance extends Sequelize.Instance<IUserAccountOld>, IUserAccountOld {}

export const UserAccountOld = sequelize.define<IUserAccountOldInstance, IUserAccountOld>(
    'userAccountOld',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {type: Sequelize.INTEGER},
        month_year: {type: Sequelize.STRING},
        total_amount_earned: {type: Sequelize.DECIMAL(10, 2)},
        total_service_charge: {type: Sequelize.DECIMAL(10, 2)},
        total_delivery_charge: {type: Sequelize.DECIMAL(10, 2)},
        pending_service_charge: {type: Sequelize.DECIMAL(10, 2)},
        total_gst_charge: {type: Sequelize.DECIMAL(10, 2)},
        pending_gst_charge: {type: Sequelize.DECIMAL(10, 2)},
        fb_total_amount: {type: Sequelize.DECIMAL(10, 2)},
        fb_pending_amount: {type: Sequelize.DECIMAL(10, 2)},
        fb_cleared_amount: {type: Sequelize.DECIMAL(10, 2)},
        paytm_amount: {type: Sequelize.DECIMAL(10, 2)},
        paytm_refund_amount: {type: Sequelize.DECIMAL(10, 2)},
        paid_service_charge: {type: Sequelize.DECIMAL(10, 2)},
        cleared_amount: {type: Sequelize.DECIMAL(10, 2)},
        paid_gst_charge: {type: Sequelize.DECIMAL(10, 2)},
        pk_payment_gateway_charges: {type: Sequelize.DECIMAL(10, 2)},
        pk_plan_charges: {type: Sequelize.DECIMAL(10, 2)},
    },
    {
        tableName: 'user_accounts',
        timestamps: false,
    },
);

export default UserAccountOld;
