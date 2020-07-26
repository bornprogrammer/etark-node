"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const SequelizeConnection_1 = require("@app/SequelizeConnection");
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    mobileNumber: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        field: "mobile_number"
    },
    password: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.STRING(16)
    }
}, {
    tableName: "users",
    sequelize: SequelizeConnection_1.sequelizeConnection.connection,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
});
//# sourceMappingURL=User.js.map