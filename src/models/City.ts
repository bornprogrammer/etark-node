import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { PickupDelivery } from "./PickupDelivery";
import { ServiceCenters } from "./ServiceCenters";



export class City extends Model {
}

City.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state_id: {
        type: DataTypes.INTEGER.UNSIGNED,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    }
}, {
    tableName: "cities",
    sequelize: sequelizeConnection.connection,
    underscored: true,
    timestamps: false
})

City.hasMany(ServiceCenters);

ServiceCenters.belongsTo(City, { as: "cityDetail" });