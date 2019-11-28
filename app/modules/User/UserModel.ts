import { sequelize } from '@app/config/Sequelize';
import IUser from '@app/interfaces/models/IUser';
import DishModel from '@app/modules/Dish/DishModel';
import * as Sequelize from 'sequelize';

interface IUserInstance extends Sequelize.Instance<IUser>, IUser {}

const UserModel = sequelize.define<IUserInstance, IUser>(
    'users',
    {
        id: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        phone: {
         type: Sequelize.INTEGER,
         allowNull: false,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
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
);

export default UserModel;
