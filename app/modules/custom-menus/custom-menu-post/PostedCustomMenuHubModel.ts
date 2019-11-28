import { sequelize } from '@app/config/Sequelize';
import * as Sequelize from 'sequelize';
import IPostedCustomMenuUser from './IPostedCustomMenuHub';

interface IPostedCustomMenuUserInstance extends Sequelize.Instance<IPostedCustomMenuUser>, IPostedCustomMenuUser {}

const PostedCustomMenuHub = sequelize.define<IPostedCustomMenuUserInstance, IPostedCustomMenuUser>(
    'posted_custom_menu_hub',
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
        hubId: {
            type: Sequelize.INTEGER,
            field: 'hub_id',
        },
    },
    {
        underscored: true,
        timestamps: true,
    },
);

export default PostedCustomMenuHub;
