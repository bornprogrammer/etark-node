"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceCenters = void 0;
const sequelize_1 = require("sequelize");
const SequelizeConnection_1 = require("@app/SequelizeConnection");
class ServiceCenters extends sequelize_1.Model {
}
exports.ServiceCenters = ServiceCenters;
ServiceCenters.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    city_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    lat: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    lon: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: SequelizeConnection_1.sequelizeConnection.connection,
    tableName: "service_centers",
    underscored: true,
});
//# sourceMappingURL=ServiceCenters.js.map