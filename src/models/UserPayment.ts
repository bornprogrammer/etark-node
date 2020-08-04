import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";

export class UserPayment extends Model {

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
    txn_token: {
        type: DataTypes.STRING,
    },
    order_no: {
        type: DataTypes.STRING,
    },
    total_payment: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    payment_status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        allowNull: false,
        defaultValue: "pending"
    }
}, {
    sequelize: sequelizeConnection.connection,
    tableName: "user_payment",
    underscored: true,
})