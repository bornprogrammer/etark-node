import { sequelize } from '@app/config/Sequelize';
import IUserBankAccount from '@app/interfaces/models/IUserBankAccount';
import * as Sequelize from 'sequelize';

interface IUserBankAccountInstance extends
    Sequelize.Instance<IUserBankAccount>, IUserBankAccount {}

const UserBankAccount = sequelize
    .define<IUserBankAccountInstance, IUserBankAccount>(
    'UserBankAccount',
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
        accountNumber: {
            type: Sequelize.STRING,
            field: 'account_number',
        },
        ifsc: {
            type: Sequelize.STRING,
        },
        accountHolderName: {
            type: Sequelize.STRING,
            field: 'account_holder_name',
        },
        validationStatus: {
            type: Sequelize.INTEGER,
            field: 'validation_status',
        },
    },
    {
        tableName: 'user_bank_accounts',
        underscored: true,
        timestamps: true,
    },
);

export default UserBankAccount;
