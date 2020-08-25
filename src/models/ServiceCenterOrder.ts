import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";

export interface ServiceCenterOrderAttributes {
    id?: number;
    pickup_delivery_id: number;
    imei_number: string;
    device_front_image: string;
    device_back_image: string;
    phone_warranty: string;
    service_to_be_done: string;
    invoice_total_amount: number;
    proforma_invoice_image: string;
    final_invoice_image: string;
    device_delivery_date: string
    due_date: string;
}

export class ServiceCenterOrder extends Model implements ServiceCenterOrderAttributes {
    id: number;
    pickup_delivery_id: number;
    imei_number: string;
    device_front_image: string;
    device_back_image: string;
    phone_warranty: string;
    service_to_be_done: string;
    invoice_total_amount: number;
    invoice_image: string;
    due_date: string;
    proforma_invoice_image: string;
    final_invoice_image: string;
    device_delivery_date: string;
}

ServiceCenterOrder.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    pickup_delivery_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    imei_number: {
        type: DataTypes.STRING,
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
    phone_warranty: {
        type: DataTypes.ENUM('in_warranty', 'non_warranty', 'out_of_warranty'),
        allowNull: false
    },
    service_to_be_done: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    invoice_total_amount: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: false,
    },
    proforma_invoice_image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    final_invoice_image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    device_delivery_date: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize: sequelizeConnection.connection,
    tableName: "service_center_orders",
    underscored: true
})