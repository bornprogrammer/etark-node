import { sequelize } from '@app/config/Sequelize';
import IDish from '@app/interfaces/models/IDish';
import * as Sequelize from 'sequelize';

interface IDishInstance extends Sequelize.Instance<IDish>, IDish {}

const Dish = sequelize.define<IDishInstance, IDish>(
    'dishes',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        buddyId: {type: Sequelize.INTEGER, field: 'buddy_id'},
        name: {type: Sequelize.STRING},
        description: {type: Sequelize.STRING},
        dishType: {type: Sequelize.STRING, field: 'dish_type'},
        dishContent: {type: Sequelize.STRING, field: 'dish_content'},
        servings: {type: Sequelize.INTEGER},
        remainingServings: {type: Sequelize.INTEGER, field: 'remaining_servings'},
        orderEndTime: {type: Sequelize.DATE, field: 'order_end_time'},
        preparationEndTime: {type: Sequelize.DATE, field: 'preparation_end_time'},
        cost: {type: Sequelize.INTEGER},
        serviceCharge: {type: Sequelize.INTEGER, field: 'service_charge'},
        netCost: {type: Sequelize.INTEGER, field: 'net_cost'},
        deliveryCharge: {type: Sequelize.INTEGER, field: 'delivery_charge'},
        autoConfirm: {type: Sequelize.TINYINT, field: 'auto_confirm'},
        addressOption: {type: Sequelize.STRING, field: 'address_option'},
        addressId: {type: Sequelize.TINYINT, field: 'address_id'},
        categoryId: {type: Sequelize.TINYINT, field: 'category_id'},
        isEnable: {type: Sequelize.TINYINT, field: 'is_enable'},
        isDeleted: {type: Sequelize.TINYINT, field: 'is_deleted'},
        hidden: {type: Sequelize.INTEGER},
        tagId: {type: Sequelize.INTEGER, field: 'tag_id'},
        thumbId: {type: Sequelize.INTEGER, field: 'thumb_id'},
        dishSchedularId: {type: Sequelize.INTEGER, field: 'dish_schedular_id'},
        rating: {type: Sequelize.INTEGER},
        level: {type: Sequelize.STRING},
        points: {type: Sequelize.INTEGER},
        currentWeekPoints: {type: Sequelize.INTEGER, field: 'current_week_point'},
        lastWeekPoints: {type: Sequelize.INTEGER, field: 'last_week_points'},
        isAccountUpdated: {type: Sequelize.INTEGER, field: 'is_account_updated'},
        postType: {type: Sequelize.STRING, field: 'post_type'},
        bookmarks: {type: Sequelize.STRING},
        isPriceEditable: {type: Sequelize.STRING, field: 'is_price_editable'},
        cronPointsUpdatedAt: {type: Sequelize.DATE, field: 'cron_points_updated_at'},
        lastWeekBookmarks: {type: Sequelize.INTEGER, field: 'last_week_bookmarks'},
        lastWeekRatings: {type: Sequelize.INTEGER, field: 'last_week_ratings'},
        isVisibileToSeller: {type: Sequelize.INTEGER, field: 'is_visibile_to_seller'},
        isSignatureDish: {type: Sequelize.INTEGER, field: 'is_signature_dish'},
        priceUpdatedAt: {type: Sequelize.DATE, field: 'price_updated_at'},
        createdAt: {type: Sequelize.DATE, field: 'created_at'},
        updatedAt: {type: Sequelize.DATE, field: 'updated_at'},
    },
);

Dish.associate = (models) => {
    Dish.hasMany(models.Order, { sourceKey: 'id', foreignKey: 'dish_id' });
};

export {Dish};

export default Dish;
