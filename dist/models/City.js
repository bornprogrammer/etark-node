"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.City = void 0;
const sequelize_1 = require("sequelize");
const SequelizeConnection_1 = require("@app/SequelizeConnection");
class City extends sequelize_1.Model {
}
exports.City = City;
City.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    state_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    }
}, {
    tableName: "cities",
    sequelize: SequelizeConnection_1.sequelizeConnection.connection,
    underscored: true,
    timestamps: false
});
//# sourceMappingURL=City.js.map