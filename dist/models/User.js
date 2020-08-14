"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const SequelizeConnection_1 = require("@app/SequelizeConnection");
const UserStatusEnum_1 = require("@app/enums/UserStatusEnum");
const Complaint_1 = require("./Complaint");
// export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
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
    mobile_number: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.STRING(16),
        defaultValue: UserStatusEnum_1.UserStatusEnum.ACTIVE
    }
}, {
    tableName: "users",
    sequelize: SequelizeConnection_1.sequelizeConnection.connection,
    timestamps: true,
    updatedAt: false,
    underscored: true,
});
User.hasMany(Complaint_1.Complaint, { as: "complaints", foreignKey: "user_id" });
Complaint_1.Complaint.belongsTo(User, { as: "user", foreignKey: "user_id" });
//# sourceMappingURL=User.js.map