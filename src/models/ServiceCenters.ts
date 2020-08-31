import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";


export interface ServiceCentersAttributes {
    id?: number;
    city_id: number;
    name: string;
    lat: string;
    lon: string;
    status: string;
    address: string;
    store_contact_no: string;
    manager_contact_no: string;
    store_timings: string;
    availibility_in_a_week: string;
    email: string;
    service_center_type: string;
    password: string;
}


export class ServiceCenters extends Model implements ServiceCentersAttributes {
    id?: number;
    city_id: number;
    name: string;
    lat: string;
    lon: string;
    status: string;
    address: string;
    store_contact_no: string;
    manager_contact_no: string;
    store_timings: string;
    availibility_in_a_week: string;
    email: string;
    service_center_type: string;
    password: string;

}

ServiceCenters.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    city_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lat: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lon: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'deleted'),
        defaultValue: 'active'
    },
    address: {
        type: DataTypes.STRING,
    }
    ,
    store_contact_no: {
        type: DataTypes.STRING,
    },
    manager_contact_no: {
        type: DataTypes.STRING,
    },
    store_timings: {
        type: DataTypes.STRING,
    },
    availibility_in_a_week: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    service_center_type: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    }

}, {
    sequelize: sequelizeConnection.connection,
    tableName: "service_centers",
    underscored: true,
})