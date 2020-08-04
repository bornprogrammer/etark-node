import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";

export class UserPlan extends Model { }

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
    is_pickup_delivery_choosed: {
        type: DataTypes.ENUM('yes', 'no'),
        allowNull: false,
        defaultValue: "yes"
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        allowNull: false,
        defaultValue: "pending"
    }
}, {
    sequelize: sequelizeConnection.connection,
    tableName: "user_plan",
    underscored: true
}
)