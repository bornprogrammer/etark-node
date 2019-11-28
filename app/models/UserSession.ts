import { sequelize } from '@app/config/Sequelize';
import IUserSession from '@app/interfaces/models/IUserSession';
import * as Sequelize from 'sequelize';

interface IUserSessionInstance extends Sequelize.Instance<IUserSession>, IUserSession {}

const UserSession = sequelize.define<IUserSessionInstance, IUserSession>(
    'user_sessions',
    {
        id: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'user_id',
        },
        token: {
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

UserSession.associate = (models) => {
    UserSession.belongsTo(models.User, { targetKey: 'id', foreignKey: 'user_id' });
};

export default UserSession;
