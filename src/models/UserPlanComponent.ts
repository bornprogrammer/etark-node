import { Model, DataTypes, Optional } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { PlanComponent } from "./PlanComponents";

export interface UserPlanComponentAttributes {
    id?: number;
    user_plan_id: number;
    plan_components_id: number;
    status: string;
    component_price: number
}

export interface UserPlanComponentCreationAttributes extends Optional<UserPlanComponentAttributes, 'id'> { }

// export class UserPlanComponent extends Model<UserPlanComponentAttributes, UserPlanComponentCreationAttributes> implements UserPlanComponentAttributes {
export class UserPlanComponent extends Model {
    id: number;
    user_plan_id: number;
    plan_components_id: number;
    status: string;
    component_price: number;
    public readonly planComponent?: PlanComponent;
}

UserPlanComponent.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    user_plan_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    plan_components_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'deleted'),
        defaultValue: 'active'
    },
    component_price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    sequelize: sequelizeConnection.connection,
    underscored: true,
    tableName: "user_plan_components",
    timestamps: false
})

