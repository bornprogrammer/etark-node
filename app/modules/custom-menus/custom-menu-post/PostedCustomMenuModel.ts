
import { sequelize } from '@app/config/Sequelize';
import * as Sequelize from 'sequelize';
import IPostedCustomMenu from './IPostedCustomMenu';

interface IPostedCustomMenuInstance extends Sequelize.Instance<IPostedCustomMenu>, IPostedCustomMenu {}

const PostedCustomMenu = sequelize.define<IPostedCustomMenuInstance, IPostedCustomMenu >(
    'posted_custom_menu',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        customMenuId: {
            type: Sequelize.INTEGER,
            field: 'custom_menu_id',

        },
        advancedPayment: {
            type: Sequelize.INTEGER,
            field: 'advance_payment',
        },
        advanceNoticeTime: {
            type: Sequelize.INTEGER,
            field: 'advance_notice_time',
        },
        minimumCartValue: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: true,
            field: 'minimum_cart_value',
        },
        servingLimits: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'serving_limits',
        },
        discountThreshold: {
            type: Sequelize.INTEGER,
            field: 'discount_threshold',
        },
        postType: {
            type: Sequelize.STRING,
            field: 'post_type',

        },
    },
    {
        underscored: true,
        timestamps: true,
    },
);

export default PostedCustomMenu;
