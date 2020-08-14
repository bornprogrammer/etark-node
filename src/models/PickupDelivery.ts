
import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";

export interface PickupDeliveryAttirbutes {
    id: number;
    user_plan_id: number;
    service_center_id: number;
    delivery_amount: number;
    created_at: string;
    updated_at: string;
}

export class PickupDelivery extends Model implements PickupDeliveryAttirbutes {
    id: number;
    user_plan_id: number;
    service_center_id: number;
    delivery_amount: number;
    created_at: string;
    updated_at: string;
}

PickupDelivery.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    user_plan_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    service_center_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    delivery_amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    tableName: "pickup_deliveries",
    underscored: true,
    sequelize: sequelizeConnection.connection
})