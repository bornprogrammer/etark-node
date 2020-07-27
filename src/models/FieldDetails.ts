import { Optional, DataTypes } from "sequelize/types";
import { Model } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { json } from "sequelize";

interface FieldDetailsAttributes {
    id: number,
    field_id: number,
    details: string
}

interface FieldDetailsCreationAttributes extends Optional<FieldDetailsAttributes, 'id'> {

}

class FieldDetails extends Model<FieldDetailsAttributes, FieldDetailsCreationAttributes> implements FieldDetailsAttributes {
    id: number;
    field_id: number;
    details: string;
}

FieldDetails.init({
    details: {
        type: DataTypes.JSON,
        allowNull: false
    },
    field_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    sequelize: sequelizeConnection.connection,
    tableName: "field_details",
    underscored: true

})