"use strict";
// import { Model, DataTypes, Optional } from "sequelize";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakerDetails = void 0;
const sequelize_1 = require("sequelize");
const SequelizeConnection_1 = require("@app/SequelizeConnection");
const Complaint_1 = require("./Complaint");
// export class MakerDetails extends Model<MakerDetailsAttributes, MakerDetailsCreationAttributes> implements MakerDetailsAttributes {
class MakerDetails extends sequelize_1.Model {
}
exports.MakerDetails = MakerDetails;
MakerDetails.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    category_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    display_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    maker_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    inspection_charges: {
        type: sequelize_1.DataTypes.NUMBER,
    }
}, {
    tableName: "maker_detail",
    underscored: true,
    sequelize: SequelizeConnection_1.sequelizeConnection.connection,
    timestamps: false
});
MakerDetails.hasMany(Complaint_1.Complaint, { foreignKey: "maker_detail_id" });
Complaint_1.Complaint.belongsTo(MakerDetails, { as: "makerDetail", foreignKey: "maker_detail_id" });
//# sourceMappingURL=MakerDetails.js.map