// this script updates paidOverallCharge and receivedOnlineOrdersAmount columns of account summary
// it needs to be run after every account settlement
import * as dotenv from 'dotenv';
dotenv.config();

import DIContainer from '@app/DIContainer';
import Logger from '@app/services/Logger';

const accountsScriptService = DIContainer.accountsScriptService();

accountsScriptService.duplicateBuddyWalletDebitsWithUpdatedOrigin().then((summary) => {
    Logger.info(summary);
    process.exit();
}).catch((err) => {
    Logger.info(err);
});
