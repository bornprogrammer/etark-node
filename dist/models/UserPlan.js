"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPlan = void 0;
const sequelize_1 = require("sequelize");
const SequelizeConnection_1 = require("@app/SequelizeConnection");
const UserPlanComponent_1 = require("./UserPlanComponent");
const UserPayment_1 = require("./UserPayment");
// export class UserPlan extends Model<UserPlanAttributes, UserPlanCreationAttributes>{
class UserPlan extends sequelize_1.Model {
}
exports.UserPlan = UserPlan;
UserPlan.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    complain_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    plan_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: "pending"
    }
}, {
    sequelize: SequelizeConnection_1.sequelizeConnection.connection,
    tableName: "user_plan",
    underscored: true
});
UserPlan.hasMany(UserPlanComponent_1.UserPlanComponent);
UserPlanComponent_1.UserPlanComponent.belongsTo(UserPlan);
UserPlan.hasMany(UserPayment_1.UserPayment, {
    as: "userPayments"
});
UserPayment_1.UserPayment.belongsTo(UserPlan);
//# sourceMappingURL=UserPlan.js.map