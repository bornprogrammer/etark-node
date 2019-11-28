import { sequelize } from '@app/config/Sequelize';
import CashfreeBatchPayoutConstants from '@app/constants/CashfreeBatchPayoutConstants';
import ICashfreeBatchPayout from '@app/interfaces/models/ICashfreeBatchPayout';
import * as Sequelize from 'sequelize';

interface ICashfreeBatchPayoutInstance extends
    Sequelize.Instance<ICashfreeBatchPayout>, ICashfreeBatchPayout {}

const CashfreeBatchPayout = sequelize
    .define<ICashfreeBatchPayoutInstance, ICashfreeBatchPayout>(
    'CashfreeBatchPayout',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        batchTransferId: {
            type: Sequelize.STRING,
            field: 'batch_transfer_id',
        },
        referenceId: {
            type: Sequelize.INTEGER,
            field: 'reference_id',
        },
        totalTransactionsCount: {
            type: Sequelize.INTEGER,
            field: 'total_transactions_count',
        },
        successfullTransactionsCount: {
            type: Sequelize.INTEGER,
            field: 'successfull_transactions_count',
        },
        failedTransactionsCount: {
            type: Sequelize.INTEGER,
            field: 'failed_transactions_count',
        },
        status: {
            type: Sequelize.INTEGER,
            defaultValue: CashfreeBatchPayoutConstants.STATUS.UNPROCESSED,
        },
        cronJobId: {
            type: Sequelize.INTEGER,
            field: 'cron_job_id',
        },
    },
    {
        tableName: 'cashfree_batch_payouts',
        underscored: true,
        timestamps: true,
    },
);

CashfreeBatchPayout.associate = (models) => {
    CashfreeBatchPayout.hasMany(models.CashfreeBuddyPayout,
        {
            foreignKey: 'cashfree_batch_payout_id',
        },
    );
};

export default CashfreeBatchPayout;
