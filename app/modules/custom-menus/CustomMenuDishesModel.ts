
import { sequelize } from '@app/config/Sequelize';
import * as Sequelize from 'sequelize';

import DishModel from '@app/modules/Dish/DishModel';
import ICustomMenuDishes from './ICustomMenuDishes';

interface ICustomMenuDishesInstance extends Sequelize.Instance<ICustomMenuDishes>, ICustomMenuDishes { }

const CustomMenuDishes = sequelize.define<ICustomMenuDishesInstance, ICustomMenuDishes>(
    'custom_menu_dishes',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        customMenuId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'custom_menu_id',
        },
        dishId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'dish_id',
            references: {
                model: 'dishes',
                key: 'id',
            },
        },
        isEnable: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: 1,
            field: 'is_enable',
        },
    }, {
        timestamps: true,
        underscored: true,
    },
);

export default CustomMenuDishes;
