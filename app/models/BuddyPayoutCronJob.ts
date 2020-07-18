import { sequelize } from '@app/config/Sequelize';
import BuddyPayoutCronJobConstants from '@app/constants/BuddyPayoutCronJobConstants';
import IBuddyPayoutCronLog from '@app/interfaces/models/IBuddyPayoutCronJob';
import * as Sequelize from 'sequelize';

interface IBuddyPayoutCronLogInstance extends
    Sequelize.Instance<IBuddyPayoutCronLog>, IBuddyPayoutCronLog {}

const BuddyPayoutCronJob = sequelize
    .define<IBuddyPayoutCronLogInstance, IBuddyPayoutCronLog>(
    'BuddyPayoutCronJob',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        totalEligibleTransfers: {
            type: Sequelize.INTEGER,
            field: 'total_eligible_transfers',
            defaultValue: 0,
        },
        usersWithoutPaymentDetails: {
            type: Sequelize.INTEGER,
            field: 'users_without_payment_details',
            defaultValue: 0,
        },
        totalBankTransfers: {
            type: Sequelize.INTEGER,
            field: 'total_bank_transfers',
            defaultValue: 0,
        },
        totalPaytmTransfers: {
            type: Sequelize.INTEGER,
            field: 'total_paytm_transfers',
            defaultValue: 0,
        },
        successfullBankTransfers: {
            type: Sequelize.INTEGER,
            field: 'successfull_bank_transfers',
            defaultValue: 0,
        },
        unsuccessfullBankTransfers: {
            type: Sequelize.INTEGER,
            field: 'unsuccessfull_bank_transfers',
            defaultValue: 0,
        },
        successfullPaytmTransfers: {
            type: Sequelize.INTEGER,
            field: 'successfull_paytm_transfers',
            defaultValue: 0,
        },
        unsuccessfullPaytmTransfers: {
            type: Sequelize.INTEGER,
            field: 'unsuccessfull_paytm_transfers',
            defaultValue: 0,
        },
        status: {
            type: Sequelize.INTEGER,
            defaultValue: BuddyPayoutCronJobConstants.STATUS.UNPROCESSED,
        },
        processedAt: {
            type: Sequelize.TIME,
            field: 'processed_at',
        },
    },
    {
        tableName: 'buddy_payout_cron_jobs',
        underscored: true,
        timestamps: true,
    },
);

BuddyPayoutCronJob.associate = (models) => {
    BuddyPayoutCronJob.hasMany(models.CashfreeBatchPayout,
        {
            foreignKey: 'cron_job_id',
        },
    );
};

export default BuddyPayoutCronJob;
