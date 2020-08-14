"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
const sequelize_1 = require("sequelize");
const SequelizeConnection_1 = require("@app/SequelizeConnection");
const ComplaintDetails_1 = require("./ComplaintDetails");
// export class Field extends Model<FieldAttributes, FieldCreationAttributes> implements FieldAttributes {
class Field extends sequelize_1.Model {
}
exports.Field = Field;
Field.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    category_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    field_lookup_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    field_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    label: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    placeholder: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "fields",
    sequelize: SequelizeConnection_1.sequelizeConnection.connection,
    timestamps: true,
    updatedAt: false,
    underscored: true,
});
Field.hasMany(ComplaintDetails_1.ComplaintDetails, { foreignKey: "field_id" });
ComplaintDetails_1.ComplaintDetails.belongsTo(Field, { as: "field", foreignKey: "field_id" });
//# sourceMappingURL=Field.js.map