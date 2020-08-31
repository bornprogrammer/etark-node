import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";

export interface DeviceDispatchDetailsAttributes {
    id?: number;
    pick_delivery_id: number;
    device_front_image: number;
    device_back_image: number;
    final_invoice_image: number;
}

export class DeviceDispatchDetails extends Model implements DeviceDispatchDetailsAttributes {
    id: number;
    pick_delivery_id: number;
    device_front_image: number;
    device_back_image: number;
    final_invoice_image: number;
}

DeviceDispatchDetails.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    pick_delivery_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    device_front_image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    device_back_image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    final_invoice_image: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "device_dispatch_details",
    sequelize: sequelizeConnection.connection,
    underscored: true
})