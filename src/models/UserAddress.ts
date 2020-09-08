
import { Model, DataTypes } from "sequelize";

import { sequelizeConnection } from "@app/SequelizeConnection";
import { PickupDelivery } from "./PickupDelivery";
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
    },
    city_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: null
    },
    complain_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: null
    },
    lat: {
        type: DataTypes.STRING,
    },
    lon: {
        type: DataTypes.STRING,
    }
}, {
    tableName: "user_address",
    underscored: true,
    sequelize: sequelizeConnection.connection
})

UserAddress.hasMany(PickupDelivery, { foreignKey: "user_address_id" });

PickupDelivery.belongsTo(UserAddress, { foreignKey: "user_address_id", as: PickupDelivery.userAddressAs });
