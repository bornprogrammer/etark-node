// this script populates the buddy_account_transactions table
// by copying data from legacy user_transaction table
// it needs to be run after every old way of account settlement
// it will not be used after we migrate to revamped account summary
import * as dotenv from 'dotenv';
dotenv.config();

import DIContainer from '@app/DIContainer';
import Logger from '@app/services/Logger';

const accountsScriptService = DIContainer.accountsScriptService();

// record start time
const startTime: any = new Date();

accountsScriptService.populateBuddyAccountTransactions().then((createdCount) => {
    const endTime: any = new Date();

    const timeDiff = (endTime - startTime) / 1000;
    Logger.info({timeDiff});

    Logger.info({createdCount});
    process.exit();
}).catch((err) => {
    Logger.info(err.stack);
    process.exit();
});
