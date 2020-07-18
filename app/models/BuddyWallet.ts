import { sequelize } from '@app/config/Sequelize';
import IBuddyWallet from '@app/interfaces/models/IBuddyWallet';
import * as Sequelize from 'sequelize';

interface IBuddyWalletInstance extends Sequelize.Instance<IBuddyWallet>, IBuddyWallet {}

const BuddyWallet = sequelize.define<IBuddyWalletInstance, IBuddyWallet>(
    'buddy_wallet',
    {
        id: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            field: 'user_id',
        },
        transactionType: {
            type: Sequelize.ENUM('CREDIT', 'DEBIT'),
            allowNull: false,
            field: 'transaction_type',
        },
        origin: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        originId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'origin_id',
        },
        description: {
            type: Sequelize.JSON,
            allowNull: true,
        },
        amount: {
            type: Sequelize.INTEGER,
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
    {
        tableName: 'buddy_wallet',
    },
);

BuddyWallet.associate = (models) => {
    BuddyWallet.belongsTo(models.User, { targetKey: 'id', foreignKey: 'user_id' });
};

export default BuddyWallet;
