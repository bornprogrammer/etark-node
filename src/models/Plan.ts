import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { PlanComponents } from "./PlanComponents";


export class Plan extends Model {

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
})
Plan.hasMany(PlanComponents);

PlanComponents.belongsTo(Plan);