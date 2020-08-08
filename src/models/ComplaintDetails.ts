
import { Model, Optional, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";

interface ComplaintDetailsAttributes {
    id: number,
    complaint_id: number,
    field_id: number,
    field_val: string,
}

interface ComplaintDetailsCreationAttributes extends Optional<ComplaintDetailsAttributes, 'id'> { }

// export class ComplaintDetails extends Model<ComplaintDetailsAttributes, ComplaintDetailsCreationAttributes> implements ComplaintDetailsAttributes {
export class ComplaintDetails extends Model implements ComplaintDetailsAttributes {
    id: number;
    complaint_id: number;
    field_id: number;
    field_val: string;
}
ComplaintDetails.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    complaint_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    field_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    field_val: {
        type: DataTypes.STRING,
    }
}, {
    sequelize: sequelizeConnection.connection,
    underscored: true,
    tableName: "complaint_details",
    timestamps: false
})

