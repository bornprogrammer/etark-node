import { sequelize } from '@app/config/Sequelize';
import IBuddyPayoutMissingAccount from '@app/interfaces/models/IBuddyPayoutMissingAccount';
import * as Sequelize from 'sequelize';

interface IBuddyPayoutMissingAccountInstance extends
    Sequelize.Instance<IBuddyPayoutMissingAccount>, IBuddyPayoutMissingAccount {}

const BuddyPayoutMissingAccount = sequelize
    .define<IBuddyPayoutMissingAccountInstance, IBuddyPayoutMissingAccount>(
    'BuddyPayoutMissingAccount',
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
        cronJobId: {
            type: Sequelize.INTEGER,
            field: 'cron_job_id',
        },
    },
    {
        tableName: 'buddy_payout_missing_accounts',
        underscored: true,
        timestamps: true,
    },
);

export default BuddyPayoutMissingAccount;
