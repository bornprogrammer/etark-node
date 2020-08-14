"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPaymentDetails = void 0;
const sequelize_1 = require("sequelize");
const SequelizeConnection_1 = require("@app/SequelizeConnection");
class UserPaymentDetails extends sequelize_1.Model {
}
exports.UserPaymentDetails = UserPaymentDetails;
UserPaymentDetails.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    gateway_response: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    user_payment_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    }
}, {
    sequelize: SequelizeConnection_1.sequelizeConnection.connection,
    tableName: "user_payment_details",
    underscored: true,
});
//# sourceMappingURL=UserPaymentDetails.js.map