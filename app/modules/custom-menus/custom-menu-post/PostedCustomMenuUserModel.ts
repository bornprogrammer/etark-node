import { sequelize } from '@app/config/Sequelize';
import * as Sequelize from 'sequelize';
import IPostedCustomMenuUser from './IPostedCustomMenuUser';

interface IPostedCustomMenuUserInstance extends Sequelize.Instance<IPostedCustomMenuUser>, IPostedCustomMenuUser {}

const PostedCustomMenuUser = sequelize.define<IPostedCustomMenuUserInstance, IPostedCustomMenuUser>(
    'posted_custom_menu_users',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        postedCustomMenuId: {
            type: Sequelize.INTEGER,
            field: 'posted_custom_menu_id',
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
            field: 'is_active'        },
        userId: {
            type: Sequelize.INTEGER,
            field: 'user_id',
        },
    },
    {
        underscored: true,
        timestamps: true,
    },
);

export default PostedCustomMenuUser;
