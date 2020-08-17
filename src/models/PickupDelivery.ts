
import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";

export interface PickupDeliveryAttirbutes {
    id?: number;
    user_plan_id: number;
    service_center_id: number;
    delivery_amount: number;
    distance_meters: number;
}

export class PickupDelivery extends Model implements PickupDeliveryAttirbutes {
    id: number;
    user_plan_id: number;
    service_center_id: number;
    delivery_amount: number;
    distance_meters: number
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
    },
    distance_meters: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'success', 'service_denied')
    }
}, {
    tableName: "pickup_deliveries",
    underscored: true,
    sequelize: sequelizeConnection.connection
})