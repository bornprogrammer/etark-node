import { Optional, DataTypes } from "sequelize/types";
import { Model } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";


interface MakerAttribute {
    id: number;
    maker_name: string;
}


interface MakerCreationAttribute extends Optional<MakerAttribute, 'id'> { }

export class Maker extends Model<MakerAttribute, MakerCreationAttribute> implements MakerAttribute {
    id: number;
    maker_name: string;
}

Maker.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    maker_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "makers",
    underscored: true,
    sequelize: sequelizeConnection.connection
})

