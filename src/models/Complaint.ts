import { Optional, DataTypes } from "sequelize/types";
import { Model } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";


interface ComplaintAttributes {
    id: number,
    user_id: number,
    maker_detail_id: number,
    // created_at: string,
    // updated_at: string,
    status: string
}

interface ComplaintCreationAttributes extends Optional<ComplaintAttributes, 'id'> { }

class Complaint extends Model<ComplaintAttributes, ComplaintCreationAttributes> implements ComplaintAttributes {
    id: number;
    user_id: number;
    maker_detail_id: number;
    // created_at: string;
    // updated_at: string;
    status: string;
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
        type: DataTypes.STRING,
        allowNull: false
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