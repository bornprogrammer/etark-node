import { sequelizeConnection } from "@app/SequelizeConnection";
import { DataTypes, Model } from "sequelize";


export interface RetailCustomerDetailAttributes {
    id?: number;
    customer_name: string;
    email: string;
    contact: string;
    bill_id: string;
    maker_id: number;
}

export class RetailCustomerDetail extends Model implements RetailCustomerDetailAttributes {
    id?: number;
    customer_name: string;
    email: string;
    contact: string;
    bill_id: string;
    maker_id: number;
}

RetailCustomerDetail.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    customer_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bill_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    maker_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    }
}, {
    tableName: "retail_customer_detail",
    sequelize: sequelizeConnection.connection,
    underscored: true
})