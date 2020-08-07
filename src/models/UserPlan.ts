import { Model, DataTypes, Optional } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { UserPlanComponent } from "./UserPlanComponent";


export interface UserPlanAttributes {
    id: number;
    complain_id: number;
    plan_id: number;
    status?: string
}

export interface UserPlanCreationAttributes extends Optional<UserPlanAttributes, 'id' | 'status'> {
}

export class UserPlan extends Model<UserPlanAttributes, UserPlanCreationAttributes> implements UserPlanAttributes {
    id: number;
    complain_id: number;
    plan_id: number;
    status: string;
    // export class UserPlan extends Model {
    public readonly UserPlanComponents?: UserPlanComponent[];
}

UserPlan.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    complain_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    plan_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: "pending"
    }
}, {
    sequelize: sequelizeConnection.connection,
    tableName: "user_plan",
    underscored: true
}
)

UserPlan.hasMany(UserPlanComponent);

UserPlanComponent.belongsTo(UserPlan);