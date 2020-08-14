"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maker = void 0;
const sequelize_1 = require("sequelize");
const SequelizeConnection_1 = require("@app/SequelizeConnection");
const MakerDetails_1 = require("./MakerDetails");
// export class Maker extends Model<MakerAttribute, MakerCreationAttribute> implements MakerAttribute {
class Maker extends sequelize_1.Model {
}
exports.Maker = Maker;
Maker.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    maker_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "makers",
    underscored: true,
    sequelize: SequelizeConnection_1.sequelizeConnection.connection
});
Maker.hasMany(MakerDetails_1.MakerDetails, { as: "makerDetails", foreignKey: "maker_id" });
MakerDetails_1.MakerDetails.belongsTo(Maker, { as: "maker", foreignKey: "maker_id" });
//# sourceMappingURL=Maker.js.map