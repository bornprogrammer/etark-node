import { Optional, DataTypes, Model, Association, HasManyGetAssociationsMixin } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { MakerDetails } from "./MakerDetails";
import { Complaint } from "./Complaint";

interface MakerAttribute {
    id: number;
    maker_name: string;
}

interface MakerCreationAttribute extends Optional<MakerAttribute, 'id'> { }

// export class Maker extends Model<MakerAttribute, MakerCreationAttribute> implements MakerAttribute {
export class Maker extends Model {
    id: number;
    maker_name: string;
    public static associations: {
        projects: Association<Maker, MakerDetails>;
    };
    public getMakerDetails!: HasManyGetAssociationsMixin<MakerDetails>
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

Maker.hasMany(MakerDetails, { as: "makerDetails", foreignKey: "maker_id" });

MakerDetails.belongsTo(Maker, { as: "maker", foreignKey: "maker_id" });