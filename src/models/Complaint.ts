
import { Model, Optional, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { ComplaintDetails } from "./ComplaintDetails";
import { MakerDetails } from "./MakerDetails";

interface ComplaintAttributes {
    id: number,
    user_id: number,
    maker_detail_id: number,
    status?: string
}

interface ComplaintCreationAttributes extends Optional<ComplaintAttributes, 'id'> { }

export class Complaint extends Model<ComplaintAttributes, ComplaintCreationAttributes> implements ComplaintAttributes {
    // export class Complaint extends Model {
    id: number;
    user_id: number;
    maker_detail_id: number;
    status?: string;
    public readonly complainDetails?: ComplaintDetails[];
    public readonly makerDetail?: MakerDetails;
}

Complaint.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    maker_detail_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'resolved', 'unresolved'),
        defaultValue: "pending"
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    }
}, {
    sequelize: sequelizeConnection.connection,
    underscored: true,
    tableName: "complaints"
})

Complaint.hasMany(ComplaintDetails, { as: "complainDetails" });

ComplaintDetails.belongsTo(Complaint);