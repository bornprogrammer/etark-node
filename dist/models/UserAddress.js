"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAddress = void 0;
const sequelize_1 = require("sequelize");
const SequelizeConnection_1 = require("@app/SequelizeConnection");
class UserAddress extends sequelize_1.Model {
}
exports.UserAddress = UserAddress;
UserAddress.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    zip_code: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    city_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    lat: {
        type: sequelize_1.DataTypes.STRING,
    },
    lon: {
        type: sequelize_1.DataTypes.STRING,
    }
}, {
    tableName: "user_address",
    underscored: true,
    sequelize: SequelizeConnection_1.sequelizeConnection.connection
});
//# sourceMappingURL=UserAddress.js.map