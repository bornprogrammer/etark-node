import { Optional, DataTypes } from "sequelize/types";
import { Model } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";


interface FieldAttributes {
    id: number,
    field_name: string,
    field_lookup_id: number,
    label: string,
    placeholder: string,
    category_id: number,
}

interface FieldCreationAttributes extends Optional<FieldAttributes, 'id'> {
}

// export class Field extends Model<FieldAttributes, FieldCreationAttributes> implements FieldAttributes {
export class Field extends Model {
    id: number;
    field_name: string;
    field_lookup_id: number;
    label: string;
    placeholder: string;
    category_id: number;
}

Field.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    category_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    field_lookup_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    field_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    label: {
        type: DataTypes.STRING,
        allowNull: false
    },
    placeholder: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "fields",
    sequelize: sequelizeConnection.connection,
    timestamps: true,
    updatedAt: false,
    underscored: true,
});