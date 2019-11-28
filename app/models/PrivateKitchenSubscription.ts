import { sequelize } from '@app/config/Sequelize';
import IPrivateKitchenSubscription from '@app/interfaces/models/IPrivateKitchenSubscription';
import * as Sequelize from 'sequelize';

interface IPrivateKitchenSubscriptionInstance extends
    Sequelize.Instance<IPrivateKitchenSubscription>, IPrivateKitchenSubscription {}

const PrivateKitchenSubscription = sequelize.define<IPrivateKitchenSubscriptionInstance,
    IPrivateKitchenSubscription>(
    'privateKitchenSubscription',
    {
        id: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        privateKitchenId: {
            type: Sequelize.INTEGER(11),
            field: 'private_kitchen_id',
            allowNull: false,
        },
        privateKitchenPlanPriceId: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            field: 'private_kitchen_plan_price_id',
        },
        startAction: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'start_action',
        },
        endAction: {
            type: Sequelize.STRING,
            field: 'end_action',
        },
        privateKitchenPlanId: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            field: 'private_kitchen_plan_id',
        },
        startDate: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'start_date',
        },
        endDate: {
            type: Sequelize.DATE,
            field: 'end_date',
        },
        status: {
            type: Sequelize.STRING(11),
            allowNull: false,
            field: 'status',
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
        tableName: 'private_kitchen_subscriptions',
    },
);

PrivateKitchenSubscription.associate = (models) => {
    PrivateKitchenSubscription.belongsTo(models.PrivateKitchen,
        {
            targetKey: 'id',
            foreignKey: 'private_kitchen_id',
        },
    );
    PrivateKitchenSubscription.belongsTo(models.PrivateKitchenPlanHubPrice,
        {
            targetKey: 'id',
            foreignKey: 'private_kitchen_plan_price_id',
        },
    );
};

export {PrivateKitchenSubscription};

export default PrivateKitchenSubscription;
