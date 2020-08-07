import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";

export class UserPaymentDetails extends Model {
    id: number;
    gateway_response: string
}

UserPaymentDetails.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    gateway_response: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    user_payment_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    }
}, {
    sequelize: sequelizeConnection.connection,
    tableName: "user_payment_details",
    underscored: true,
})