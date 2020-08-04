
import { Optional, DataTypes } from "sequelize/types";
import { Model } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";


interface CategoryAttributes {
    id: number;
    category_name: string;
    status: string;
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id' | 'status'> { }

// export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
export class Category extends Model {

}

Category.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
    }
}, {
    tableName: "categories",
    underscored: true,
    sequelize: sequelizeConnection.connection
})