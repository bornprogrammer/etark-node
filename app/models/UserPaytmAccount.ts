import { sequelize } from '@app/config/Sequelize';
import IUserPaytmAccount from '@app/interfaces/models/IUserPaytmAccount';
import * as Sequelize from 'sequelize';

interface IUserPaytmAccountInstance extends
    Sequelize.Instance<IUserPaytmAccount>, IUserPaytmAccount {}

const UserPaytmAccount = sequelize
    .define<IUserPaytmAccountInstance, IUserPaytmAccount>(
    'UserPaytmAccount',
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
        phone: {
            type: Sequelize.STRING,
        },
        cashfreeBeneficiaryId: {
            type: Sequelize.STRING,
            field: 'cashfree_beneficiary_id',
        },
    },
    {
        tableName: 'user_paytm_accounts',
        underscored: true,
        timestamps: true,
    },
);

export default UserPaytmAccount;
