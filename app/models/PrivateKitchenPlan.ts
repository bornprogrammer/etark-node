import { sequelize } from '@app/config/Sequelize';
import IPrivateKitchenPlan from '@app/interfaces/models/IPrivateKitchenPlan';
import * as Sequelize from 'sequelize';

interface IPrivateKitchenPlanInstance extends Sequelize.Instance<IPrivateKitchenPlan>, IPrivateKitchenPlan {}

const PrivateKitchenPlan = sequelize.define<IPrivateKitchenPlanInstance, IPrivateKitchenPlan>(
    'privateKitchenPlan',
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
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            field: 'is_deleted',
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
        tableName: 'private_kitchen_plans',
    },
);

export {PrivateKitchenPlan};

export default PrivateKitchenPlan;
