import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";

export interface UserRefundAttributes {
    id?: number;
    user_payment_id: number;
    gateway_response: string;
}

export class UserRefund extends Model implements UserRefundAttributes {
    id?: number;
    user_payment_id: number;
    gateway_response: string;
}

UserRefund.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    user_payment_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    gateway_response: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: sequelizeConnection.connection,
    underscored: true,
    tableName: "user_refunds"
})