"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldLookup = void 0;
const types_1 = require("sequelize/types");
const sequelize_1 = require("sequelize");
const SequelizeConnection_1 = require("@app/SequelizeConnection");
// export class FieldLookup extends Model<FieldLookupAttributes, FieldLookupCreationAttributes> implements FieldLookupAttributes {
class FieldLookup extends sequelize_1.Model {
}
exports.FieldLookup = FieldLookup;
FieldLookup.init({
    field_lookup_name: {
        type: types_1.DataTypes.STRING,
        allowNull: false
    },
    id: {
        type: types_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    status: {
        type: types_1.DataTypes.STRING,
    }
}, {
    tableName: "field_lookup",
    sequelize: SequelizeConnection_1.sequelizeConnection.connection,
    underscored: true,
});
//# sourceMappingURL=FieldLookup.js.map