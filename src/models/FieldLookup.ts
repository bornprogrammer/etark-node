import { Optional, DataTypes } from "sequelize/types";
import { Model } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";

interface FieldLookupAttributes {
    id: number,
    field_lookup_name: string,
    status: string
}

interface FieldLookupCreationAttributes extends Optional<FieldLookupAttributes, 'id'> {
}

// export class FieldLookup extends Model<FieldLookupAttributes, FieldLookupCreationAttributes> implements FieldLookupAttributes {
export class FieldLookup extends Model {
    id: number;
    field_lookup_name: string;
    status: string;
}

FieldLookup.init({
    field_lookup_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    status: {
        type: DataTypes.STRING,
    }
},
    {
        tableName: "field_lookup",
        sequelize: sequelizeConnection.connection,
        underscored: true,
    }
)

