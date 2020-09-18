import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { ServiceCenterPayment } from "./ServiceCenterModel";

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
    device_delivery_date: string
    due_date: string;
    not_warranty_reason?: string;
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
    device_delivery_date: string;
    not_warranty_reason?: string;
    public readonly serviceCenterPayment?: ServiceCenterPayment[];
    public static readonly serviceCenterPaymentAs?: string = "serviceCenterPayment";
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
        allowNull: true,
        defaultValue: 0
    },
    proforma_invoice_image: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ""
    },
    device_delivery_date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    due_date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    not_warranty_reason: {
        type: DataTypes.STRING,
    }
}, {
    sequelize: sequelizeConnection.connection,
    tableName: "service_center_orders",
    underscored: true
})

ServiceCenterOrder.hasMany(ServiceCenterPayment, { foreignKey: "service_center_order_id", as: ServiceCenterOrder.serviceCenterPaymentAs })