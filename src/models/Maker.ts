import { Optional, DataTypes, Model, Association } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { MakerDetails } from "./MakerDetails";

interface MakerAttribute {
    id: number;
    maker_name: string;
}

interface MakerCreationAttribute extends Optional<MakerAttribute, 'id'> { }

export class Maker extends Model<MakerAttribute, MakerCreationAttribute> implements MakerAttribute {
    id: number;
    maker_name: string;

    public static associations: {
        makerDetails: Association<Maker, MakerDetails>;
    };
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

