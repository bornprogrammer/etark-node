import { sequelize } from '@app/config/Sequelize';
import IAccountTransaction from '@app/interfaces/models/IAccountTransaction';
import * as Sequelize from 'sequelize';

interface IAccountTransactionInstance extends Sequelize.Instance<IAccountTransaction>, IAccountTransaction {}

const AccountTransaction = sequelize.define<IAccountTransactionInstance, IAccountTransaction>(
    'account_transaction',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        accountId: {
            type: Sequelize.INTEGER,
            field: 'account_id',
        },
        credit: { type: Sequelize.DECIMAL(10, 2) },
        debit: { type: Sequelize.DECIMAL(10, 2) },
    },
    {
        tableName: 'account_transaction',
        underscored: true,
        timestamps: true,
    },
);

AccountTransaction.associate = (models) => {
    AccountTransaction.belongsTo(models.UserAccountOld, { targetKey: 'id', foreignKey: 'account_id' });
};

export default AccountTransaction;
