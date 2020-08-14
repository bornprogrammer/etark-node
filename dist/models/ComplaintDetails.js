"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintDetails = void 0;
const sequelize_1 = require("sequelize");
const SequelizeConnection_1 = require("@app/SequelizeConnection");
// export class ComplaintDetails extends Model<ComplaintDetailsAttributes, ComplaintDetailsCreationAttributes> implements ComplaintDetailsAttributes {
class ComplaintDetails extends sequelize_1.Model {
}
exports.ComplaintDetails = ComplaintDetails;
ComplaintDetails.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    complaint_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    field_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    field_val: {
        type: sequelize_1.DataTypes.STRING,
    }
}, {
    sequelize: SequelizeConnection_1.sequelizeConnection.connection,
    underscored: true,
    tableName: "complaint_details",
    timestamps: false
});
//# sourceMappingURL=ComplaintDetails.js.map