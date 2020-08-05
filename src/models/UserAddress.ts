
import { Model, DataTypes } from "sequelize";

import { sequelizeConnection } from "@app/SequelizeConnection";

export class UserAddress extends Model {
}

UserAddress.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    zip_code: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    }
}, {
    tableName: "user_address",
    underscored: true,
    sequelize: sequelizeConnection.connection
})