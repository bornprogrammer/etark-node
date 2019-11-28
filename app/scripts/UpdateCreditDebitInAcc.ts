import * as dotenv from 'dotenv';
dotenv.config();

import DIContainer from '@app/DIContainer';
import Logger from '@app/services/Logger';

const accountsService = DIContainer.accountsService;

accountsService.updateCreditDebitInAccounts().then((summary) => {
    Logger.info(summary);
    process.exit();
}).catch((err) => {
    Logger.info(err);
});
