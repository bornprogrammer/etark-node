import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";

export interface UserPaymentAttributes {
    id?: number;
    user_plan_id: number;
    order_no?: string;
    grand_total: number;
    payment_status?: string;
    sub_total: number;
    tax: number;
    paytm_checksum?: string
    gateway_charge?: number
}
export class UserPayment extends Model {
    id?: number;
    user_plan_id: number;
    order_no?: string;
    grand_total: number;
    payment_status?: string;
    sub_total: number;
    tax: number;
    paytm_checksum?: string;
    gateway_charge?: number;
}

UserPayment.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    user_plan_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    order_no: {
        type: DataTypes.STRING,
    },
    grand_total: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    payment_status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        allowNull: false,
        defaultValue: "pending"
    },
    sub_total: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    tax: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    paytm_checksum: {
        type: DataTypes.STRING,
    },
    gateway_charge: {
        type: DataTypes.NUMBER.UNSIGNED,
        allowNull: false
    }
}, {
    sequelize: sequelizeConnection.connection,
    tableName: "user_payment",
    underscored: true,
})