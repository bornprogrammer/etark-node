
import { Optional, DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { ComplaintDetails } from "./ComplaintDetails";

export interface FieldAttributes {
    id: number,
    field_name: string,
    field_lookup_id: number,
    label: string,
    placeholder: string,
    category_id: number,
}

export interface FieldCreationAttributes extends Optional<FieldAttributes, 'id'> {
}

// export class Field extends Model<FieldAttributes, FieldCreationAttributes> implements FieldAttributes {
export class Field extends Model implements FieldAttributes {
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

Field.hasMany(ComplaintDetails, { foreignKey: "field_id" });

ComplaintDetails.belongsTo(Field, { as: "field", foreignKey: "field_id" });