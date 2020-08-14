"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPlanComponent = void 0;
const sequelize_1 = require("sequelize");
const SequelizeConnection_1 = require("@app/SequelizeConnection");
// export class UserPlanComponent extends Model<UserPlanComponentAttributes, UserPlanComponentCreationAttributes> implements UserPlanComponentAttributes {
class UserPlanComponent extends sequelize_1.Model {
}
exports.UserPlanComponent = UserPlanComponent;
UserPlanComponent.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    user_plan_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    plan_components_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'deleted'),
        defaultValue: 'active'
    },
    component_price: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    }
}, {
    sequelize: SequelizeConnection_1.sequelizeConnection.connection,
    underscored: true,
    tableName: "user_plan_components",
    timestamps: false
});
//# sourceMappingURL=UserPlanComponent.js.map