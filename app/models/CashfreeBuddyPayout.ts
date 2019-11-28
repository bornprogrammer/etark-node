import { sequelize } from '@app/config/Sequelize';
import CashfreeBuddyPayoutConstants from '@app/constants/CashfreeBuddyPayoutConstants';
import ICashfreeBuddyPayout from '@app/interfaces/models/ICashfreeBuddyPayout';
import * as Sequelize from 'sequelize';

interface ICashfreeBuddyPayoutInstance extends
    Sequelize.Instance<ICashfreeBuddyPayout>, ICashfreeBuddyPayout {}

const CashfreeBuddyPayout = sequelize
    .define<ICashfreeBuddyPayoutInstance, ICashfreeBuddyPayout>(
    'CashfreeBuddyPayout',
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
        bankAccountId: {
            type: Sequelize.INTEGER,
            field: 'bank_account_id',
        },
        paytmAccountId: {
            type: Sequelize.INTEGER,
            field: 'paytm_account_id',
        },
        credit: {
            type: Sequelize.DECIMAL(9, 2),
        },
        debit: {
            type: Sequelize.DECIMAL(9, 2),
        },
        amount: {
            type: Sequelize.DECIMAL(9, 2),
        },
        status: {
            type: Sequelize.INTEGER,
            defaultValue: CashfreeBuddyPayoutConstants.STATUS.UNPROCESSED,
        },
        cashfreeTransferId: {
            type: Sequelize.INTEGER,
            field: 'cashfree_transfer_id',
        },
        cashfreeReferenceId: {
            type: Sequelize.INTEGER,
            field: 'cashfree_reference_id',
        },
        failureReason: {
            type: Sequelize.INTEGER,
            field: 'failure_reason',
        },
        buddyAccountTransactionId: {
            type: Sequelize.INTEGER,
            field: 'buddy_account_transaction_id',
        },
        accountTransactionId: {
            type: Sequelize.INTEGER,
            field: 'account_transaction_id',
        },
        cronJobId: {
            type: Sequelize.INTEGER,
            field: 'cron_job_id',
        },
        cashfreeBatchPayoutId: {
            type: Sequelize.INTEGER,
            field: 'cashfree_batch_payout_id',
        },
    },
    {
        tableName: 'cashfree_buddy_payouts',
        underscored: true,
        timestamps: true,
    },
);

CashfreeBuddyPayout.associate = (models) => {
    CashfreeBuddyPayout.belongsTo(models.User, { targetKey: 'id', foreignKey: 'user_id' });
    CashfreeBuddyPayout.belongsTo(models.UserPaytmAccount, { targetKey: 'id', foreignKey: 'paytm_account_id' });
    CashfreeBuddyPayout.belongsTo(models.UserBankAccount, { targetKey: 'id', foreignKey: 'bank_account_id' });
    CashfreeBuddyPayout.belongsTo(models.CashfreeBatchPayout, {
        targetKey: 'id', foreignKey: 'cashfree_batch_payout_id',
    });
};

export default CashfreeBuddyPayout;
