import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";


export class UserPlanComponent extends Model {

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