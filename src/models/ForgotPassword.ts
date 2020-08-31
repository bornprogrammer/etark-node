
import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";

export interface ForgotPasswordAttributes {
    id?: number;
    email: string;
    status?: string;
}

export class ForgotPassword extends Model implements ForgotPasswordAttributes {

    id?: number;
    email: string;
    status: string;

}

ForgotPassword.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('active', 'done'),
        defaultValue: 'active'
    }
}, {
    tableName: "forgot_passwords",
    underscored: true,
    sequelize: sequelizeConnection.connection
})