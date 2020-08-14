"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const types_1 = require("sequelize/types");
const sequelize_1 = require("sequelize");
const SequelizeConnection_1 = require("@app/SequelizeConnection");
// export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
class Category extends sequelize_1.Model {
}
exports.Category = Category;
Category.init({
    id: {
        type: types_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    category_name: {
        type: types_1.DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: types_1.DataTypes.STRING,
    }
}, {
    tableName: "categories",
    underscored: true,
    sequelize: SequelizeConnection_1.sequelizeConnection.connection
});
//# sourceMappingURL=Category.js.map