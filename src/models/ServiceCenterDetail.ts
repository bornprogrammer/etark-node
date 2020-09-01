import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";



export interface ServiceCenterDetailAttributes {
    id?: number;
    service_center_id: number;
    maker_id: number;
}

export class ServiceCenterDetail extends Model implements ServiceCenterDetailAttributes {
    id?: number;
    service_center_id: number;
    maker_id: number;
}


ServiceCenterDetail.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    service_center_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    maker_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    }
}, {
    tableName: "service_center_detail",
    sequelize: sequelizeConnection.connection,
    underscored: true,
    timestamps: false
})