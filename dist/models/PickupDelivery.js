"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickupDelivery = void 0;
const sequelize_1 = require("sequelize");
const SequelizeConnection_1 = require("@app/SequelizeConnection");
class PickupDelivery extends sequelize_1.Model {
}
exports.PickupDelivery = PickupDelivery;
PickupDelivery.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    user_plan_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    service_center_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    delivery_amount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    }
}, {
    tableName: "pickup_deliveries",
    underscored: true,
    sequelize: SequelizeConnection_1.sequelizeConnection.connection
});
//# sourceMappingURL=PickupDelivery.js.map