import * as dotenv from 'dotenv';
dotenv.config();

import DIContainer from '@app/DIContainer';
import Logger from '@app/services/Logger';

const accountsScriptService = DIContainer.accountsScriptService();

// record start time
const startTime: any = new Date();

accountsScriptService.addMissingStatusInPk().then((summary) => {
    const endTime: any = new Date();
    const timeDiff = (endTime - startTime) / 1000;
    Logger.info({timeDiff});
    Logger.info(summary);
    process.exit();
}).catch((err) => {
    Logger.info(err);
});
