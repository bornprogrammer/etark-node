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
}
export class UserPayment extends Model {
    id?: number;
    user_plan_id: number;
    order_no?: string;
    grand_total: number;
    payment_status?: string;
    sub_total: number;
    tax: number;
    paytm_checksum?: string
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
    }
}, {
    sequelize: sequelizeConnection.connection,
    tableName: "user_payment",
    underscored: true,
})