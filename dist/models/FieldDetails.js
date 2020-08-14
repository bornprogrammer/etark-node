"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldDetails = void 0;
const types_1 = require("sequelize/types");
const sequelize_1 = require("sequelize");
const SequelizeConnection_1 = require("@app/SequelizeConnection");
// export class FieldDetails extends Model<FieldDetailsAttributes, FieldDetailsCreationAttributes> implements FieldDetailsAttributes {
class FieldDetails extends sequelize_1.Model {
}
exports.FieldDetails = FieldDetails;
FieldDetails.init({
    details: {
        type: types_1.DataTypes.JSON,
        allowNull: false
    },
    field_id: {
        type: types_1.DataTypes.INTEGER,
        allowNull: false
    },
    id: {
        type: types_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    sequelize: SequelizeConnection_1.sequelizeConnection.connection,
    tableName: "field_details",
    underscored: true
});
//# sourceMappingURL=FieldDetails.js.map