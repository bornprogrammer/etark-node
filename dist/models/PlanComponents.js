"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanComponent = void 0;
const sequelize_1 = require("sequelize");
const SequelizeConnection_1 = require("@app/SequelizeConnection");
const UserPlanComponent_1 = require("./UserPlanComponent");
class PlanComponent extends sequelize_1.Model {
}
exports.PlanComponent = PlanComponent;
PlanComponent.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    plan_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    component_type: {
        type: sequelize_1.DataTypes.ENUM('security_deposit', 'monitoring_charges', 'pickup_delivery', 'plan_price', 'inspection_charge'),
        allowNull: false,
        defaultValue: "security_deposit"
    },
    component_display_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    component_price: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    is_taxable: {
        type: sequelize_1.DataTypes.TINYINT,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'deleted'),
        allowNull: true,
        defaultValue: "active"
    }
}, {
    underscored: true,
    tableName: "plan_components",
    sequelize: SequelizeConnection_1.sequelizeConnection.connection,
    timestamps: false
});
PlanComponent.hasMany(UserPlanComponent_1.UserPlanComponent, { foreignKey: "plan_components_id" });
UserPlanComponent_1.UserPlanComponent.belongsTo(PlanComponent, { foreignKey: "plan_components_id", as: "planComponent" });
//# sourceMappingURL=PlanComponents.js.map