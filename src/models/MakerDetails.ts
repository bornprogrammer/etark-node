import { Model, DataTypes, Optional } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { Maker } from "./Maker";

interface MakerDetailsAttributes {
    id: number;
    maker_id: number;
    category_id: number;
    display_name: string;
    status: string;
}

interface MakerDetailsCreationAttributes extends Optional<MakerDetailsAttributes, 'id'> { }

export class MakerDetails extends Model<MakerDetailsAttributes, MakerDetailsCreationAttributes> implements MakerDetailsAttributes {
    id: number;
    maker_id: number;
    category_id: number;
    display_name: string;
    status: string;
}

MakerDetails.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    category_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    display_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    maker_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "maker_detail",
    underscored: true,
    sequelize: sequelizeConnection.connection
})

Maker.hasMany(MakerDetails);

MakerDetails.belongsTo(Maker);