"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Merchant = void 0;
const sequelize_1 = require("sequelize");
const SequelizeConnection_1 = require("@app/SequelizeConnection");
class Merchant extends sequelize_1.Model {
}
exports.Merchant = Merchant;
Merchant.init({
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED
    },
    merchant_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    merchant_type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    sequelize: SequelizeConnection_1.sequelizeConnection.connection,
    underscored: true,
    tableName: "merchants"
});
//# sourceMappingURL=Merchant.js.map