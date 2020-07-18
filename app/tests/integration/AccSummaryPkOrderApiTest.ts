// compare results of old and new implementation of account summary and order APIs
import * as dotenv from 'dotenv';
dotenv.config();

import DIContainer from '@app/DIContainer';
import Logger from '@app/services/Logger';

const testService = DIContainer.testService();

testService.testAllPkOrders().then((summary) => {
    Logger.debug({summary});
    process.exit();
}).catch((err) => {
    Logger.debug('Error Occured');
    Logger.info(err);
    process.exit();
});
