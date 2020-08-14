"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPayment = void 0;
const sequelize_1 = require("sequelize");
const SequelizeConnection_1 = require("@app/SequelizeConnection");
class UserPayment extends sequelize_1.Model {
}
exports.UserPayment = UserPayment;
UserPayment.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    user_plan_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    order_no: {
        type: sequelize_1.DataTypes.STRING,
    },
    grand_total: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    payment_status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'completed', 'failed'),
        allowNull: false,
        defaultValue: "pending"
    },
    sub_total: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    tax: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    paytm_checksum: {
        type: sequelize_1.DataTypes.STRING,
    },
    gateway_charge: {
        type: sequelize_1.DataTypes.NUMBER.UNSIGNED,
        allowNull: false
    }
}, {
    sequelize: SequelizeConnection_1.sequelizeConnection.connection,
    tableName: "user_payment",
    underscored: true,
});
//# sourceMappingURL=UserPayment.js.map