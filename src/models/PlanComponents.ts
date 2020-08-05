import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";

export class PlanComponents extends Model {
}

PlanComponents.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    plan_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    component_type: {
        type: DataTypes.ENUM('security_deposit', 'monitoring_charges'),
        allowNull: false,
        defaultValue: "security_deposit"
    },
    component_display_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    component_price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'deleted'),
        allowNull: true,
        defaultValue: "active"
    }
}, {
    underscored: true,
    tableName: "plan_components",
    sequelize: sequelizeConnection.connection,
    timestamps: false
})