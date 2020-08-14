"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plan = void 0;
const sequelize_1 = require("sequelize");
const SequelizeConnection_1 = require("@app/SequelizeConnection");
const PlanComponents_1 = require("./PlanComponents");
const UserPlan_1 = require("./UserPlan");
class Plan extends sequelize_1.Model {
}
exports.Plan = Plan;
Plan.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    plan_price: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    plan_type: {
        type: sequelize_1.DataTypes.ENUM('standard', 'premium'),
        allowNull: false
    },
    plan_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: "plans",
    sequelize: SequelizeConnection_1.sequelizeConnection.connection,
    underscored: true
});
Plan.hasMany(PlanComponents_1.PlanComponent);
PlanComponents_1.PlanComponent.belongsTo(Plan);
Plan.hasMany(UserPlan_1.UserPlan, { foreignKey: "plan_id" });
UserPlan_1.UserPlan.belongsTo(Plan, { as: "plan", foreignKey: "plan_id" });
//# sourceMappingURL=Plan.js.map