import { sequelize } from '@app/config/Sequelize';
import * as Sequelize from 'sequelize';
import ICustomMenu from './ICustomMenu';

interface ICustomMenuInstance extends Sequelize.Instance<ICustomMenu>, ICustomMenu {}

const CustomMenu = sequelize.define<ICustomMenuInstance, ICustomMenu>(
    'custom_menu',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        buddyId: {
            type: Sequelize.INTEGER, field: 'buddy_id'},
        name: Sequelize.STRING,
        description: Sequelize.STRING,
        isDeleted: {type: Sequelize.TINYINT, defaultValue: 0, field: 'is_deleted'},
    },
    {
        underscored: true,
        timestamps: true,
    },
);

// CustomMenu.associate = (models) => {
//     CustomMenu.hasMany(models.PostedCustomMenu, { sourceKey: 'id', foreignKey: 'custom_menu_id' }),
//     CustomMenu.belongsTo(models.User, { foreignKey: 'buddy_id' });
// };

export default CustomMenu;
