import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { UserPlanComponent } from "./UserPlanComponent";

export class PlanComponent extends Model {
    id: number;
    component_price: number;
    component_type: string;
    is_taxable: number;
    component_display_name?: string;
}

PlanComponent.init({
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
        type: DataTypes.ENUM('security_deposit', 'monitoring_charges', 'pickup_delivery', 'plan_price', 'inspection_charge'),
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
    is_taxable: {
        type: DataTypes.TINYINT,
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

PlanComponent.hasMany(UserPlanComponent, { foreignKey: "plan_components_id" });
UserPlanComponent.belongsTo(PlanComponent, { foreignKey: "plan_components_id", as: "planComponent" });