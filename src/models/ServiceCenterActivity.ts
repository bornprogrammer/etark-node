import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";

export interface ServiceCenterActivityAttributes {
    id?: number;
    pickup_delivery_id: number;
    activity_type: string;
}


export class ServiceCenterActivity extends Model implements ServiceCenterActivityAttributes {
    id: number;
    pickup_delivery_id: number;
    activity_type: string;
}

ServiceCenterActivity.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    pickup_delivery_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    activity_type: {
        type: DataTypes.ENUM('allocated', 'order_accepted', 'service_denied', 'service_denied_after_inspection', 'user_to_confirm', 'user_declined_payment', 'user_made_payment', 'inspection_fee_claimed', 'ready_to_dispatch', 'dispatched'),
        defaultValue: "allocated"
    }
}, {
    tableName: "service_center_activities",
    sequelize: sequelizeConnection.connection,
    underscored: true
})