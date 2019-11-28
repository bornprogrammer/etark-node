import { sequelize } from '@app/config/Sequelize';
import * as Sequelize from 'sequelize';
import IPrivateKitchen from './IPrivateKitchen';

interface IPrivateKitchenInstance extends Sequelize.Instance<IPrivateKitchen>, IPrivateKitchen {}

const PrivateKitchen = sequelize.define<IPrivateKitchenInstance, IPrivateKitchen>(
    'privateKitchen',
    {
        id: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'name',
        },
        createdBy: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            field: 'created_by',
        },
        securityLevel: {
            type: Sequelize.INTEGER(1),
            allowNull: false,
            field: 'security_level',
        },
        type: {
            type: Sequelize.INTEGER(1),
            allowNull: false,
            field: 'type',
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'status',
        },
        hubId: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            field: 'hub_id',
        },
        isDeleted: {
            type: Sequelize.TINYINT(1),
            allowNull: false,
            field: 'is_deleted',
        },
        isActive: {
            type: Sequelize.TINYINT(1),
            field: 'is_active',
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'created_at',
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'updated_at',
        },
    },
    {
        tableName: 'private_kitchens',
    },
);

export {PrivateKitchen};

export default PrivateKitchen;
