import { sequelizeConnection } from "@app/SequelizeConnection";
import { DataTypes, Model } from "sequelize";


export interface ServiceCenterPaymentAttributes {
    id?: number;
    service_center_order_id: number;
    gateway_response?: string;
    payment_status?: string;
}

export class ServiceCenterPayment extends Model implements ServiceCenterPaymentAttributes {
    id?: number;
    service_center_order_id: number;
    gateway_response: string;
    payment_status: string;
}

ServiceCenterPayment.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    service_center_order_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    gateway_response: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    payment_status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        allowNull: true,
        defaultValue: 'pending'
    }
}, {
    sequelize: sequelizeConnection.connection,
    underscored: true,
    tableName: "service_center_payments"
})