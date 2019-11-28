import { sequelize } from '@app/config/Sequelize';
import IBuddyAccountTransaction from '@app/interfaces/models/IBuddyAccountTransaction';
import * as Sequelize from 'sequelize';

interface IBuddyAccountTransactionInstance extends
    Sequelize.Instance<IBuddyAccountTransaction>, IBuddyAccountTransaction {}

const BuddyAccountTransaction = sequelize
    .define<IBuddyAccountTransactionInstance, IBuddyAccountTransaction>(
    'buddy_account_transactions',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: Sequelize.INTEGER,
            field: 'user_id',
        },
        credit: {
            type: Sequelize.DECIMAL(10, 2),
            defaultValue: 0,
        },
        debit: {
            type: Sequelize.DECIMAL(10, 2),
            defaultValue: 0,
        },
    },
    {
        tableName: 'buddy_account_transactions',
        underscored: true,
        timestamps: true,
    },
);

BuddyAccountTransaction.associate = (models) => {
    BuddyAccountTransaction.belongsTo(models.User, { targetKey: 'id', foreignKey: 'user_id' });
};

export default BuddyAccountTransaction;
