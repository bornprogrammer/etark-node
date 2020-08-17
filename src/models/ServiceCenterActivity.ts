import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";

export interface ServiceCenterActivityAttributes {
    id: number;
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
        type: DataTypes.ENUM('allocated', 'received_by_service_center', 'service_denied', 'awaiting_customer_payment'),
    }
}, {
    tableName: "service_center_activities",
    sequelize: sequelizeConnection.connection,
    underscored: true
})