import { Optional, DataTypes } from "sequelize/types";
import { Model } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";


interface MerchantAttributes {
    id: number,
    merchant_type: string,
    merchant_name: string,
    status: string
}

interface MerchantCreationAttributes extends Optional<MerchantAttributes, 'id' | 'status'> { }

// export class Merchant extends Model<MerchantAttributes, MerchantCreationAttributes> implements MerchantAttributes {
export class Merchant extends Model {
    id: number;
    merchant_type: string;
    merchant_name: string;
    status: string;
}

Merchant.init({
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER.UNSIGNED
    },
    merchant_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    merchant_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING
    }
}, {
    sequelize: sequelizeConnection.connection,
    underscored: true,
    tableName: "merchants"
})

