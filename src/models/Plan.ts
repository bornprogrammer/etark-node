import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { PlanComponent } from "./PlanComponents";
import { UserPlan } from "./UserPlan";


export class Plan extends Model {
    plan_type: string;
    plan_name: string
}

Plan.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    plan_price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    plan_type: {
        type: DataTypes.ENUM('standard', 'premium'),
        allowNull: false
    },
    plan_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: "plans",
    sequelize: sequelizeConnection.connection,
    underscored: true
})
Plan.hasMany(PlanComponent);

PlanComponent.belongsTo(Plan);

Plan.hasMany(UserPlan, { foreignKey: "plan_id" });

UserPlan.belongsTo(Plan, { as: UserPlan.planAs, foreignKey: "plan_id" });