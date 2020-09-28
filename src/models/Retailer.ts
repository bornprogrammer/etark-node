import { sequelizeConnection } from "@app/SequelizeConnection";
import { DataTypes, Model } from "sequelize";



export interface RetailerAttribute {
    id?: number;
    retailer_name: string;
    phone_number: string;
    password: string;
    status: string;
    zip_code?: string;
    address?: string;
}

export class Retailer extends Model implements RetailerAttribute {

    id?: number;
    retailer_name: string;
    phone_number: string;
    password: string;
    status: string;
    zip_code?: string;
    address?: string;
}

Retailer.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    retailer_name: {
        type: DataTypes.STRING,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: true,
        defaultValue: "active"
    },
    zip_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: sequelizeConnection.connection,
    tableName: "retailers",
    underscored: true
})