import { sequelize } from '@app/config/Sequelize';
import IUser from '@app/interfaces/models/IUser';
import * as Sequelize from 'sequelize';

interface IUserInstance extends Sequelize.Instance<IUser>, IUser {}

const User = sequelize.define<IUserInstance, IUser>(
    'user',
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
        phone: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        emailId: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'email_id',
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
        tableName: 'users',
    },
);

User.associate = (models) => {
    User.belongsTo(models.Order, { targetKey: 'id', foreignKey: 'foody_id' });
};

export default User;
