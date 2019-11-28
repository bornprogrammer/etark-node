import { sequelize } from '@app/config/Sequelize';
import IPrivateKitchenPlanHubPrice from '@app/interfaces/models/IPrivateKitchenPlanHubPrice';
import * as Sequelize from 'sequelize';

interface IPrivateKitchenPlanHubPriceInstance extends
    Sequelize.Instance<IPrivateKitchenPlanHubPrice>, IPrivateKitchenPlanHubPrice {}

const PrivateKitchenPlanHubPrice = sequelize.define<IPrivateKitchenPlanHubPriceInstance,
    IPrivateKitchenPlanHubPrice>(
    'privateKitchenPlanHubPrice',
    {
        id: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        planId: {
            type: Sequelize.INTEGER(11),
            field: 'plan_id',
            allowNull: false,
        },
        foodyLimit: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            field: 'foody_limit',
        },
        price: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'price',
        },
        discountPercentage: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'discount_percentage',
        },
        discountRs: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            field: 'discount_rs',
        },
        discountedPrice: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            field: 'discounted_price',
        },
        effectivePricePerDay: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            field: 'effective_price_per_day',
        },
        isDiscounted: {
            type: Sequelize.TINYINT(1),
            allowNull: false,
            field: 'is_discounted',
        },
        hubId: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            field: 'hub_id',
        },
        upgradeText: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'upgrade_text',
        },
        isBestDeal: {
            type: Sequelize.TINYINT(1),
            allowNull: false,
            field: 'is_best_deal',
        },
        isActive: {
            type: Sequelize.TINYINT(1),
            allowNull: false,
            field: 'is_active',
        },
        planExpiryDate: {
            type: Sequelize.DATE,
            field: 'plan_expiry_date',
        },
        hikedPkPlanHubPricesId: {
            type: Sequelize.DATE,
            field: 'hiked_pk_plan_hub_prices_id',
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
        tableName: 'private_kitchen_plan_hub_prices',
    },
);

PrivateKitchenPlanHubPrice.associate = (models) => {
    PrivateKitchenPlanHubPrice.belongsTo(models.PrivateKitchenPlan,
        {
            targetKey: 'id',
            foreignKey: 'plan_id',
        },
    );
};

export {PrivateKitchenPlanHubPrice};

export default PrivateKitchenPlanHubPrice;
