// this script processes all the payouts to sellers using cashfree
import * as dotenv from 'dotenv';
dotenv.config();

import DIContainer from '@app/DIContainer';
import Logger from '@app/services/Logger';
import moment from 'moment';

const buddyPayoutService = DIContainer.buddyPayoutService;

// record start time
const startTime: any = new Date();

const weekAgo = moment.utc().subtract(8, 'days');

buddyPayoutService.processBuddyPayouts(weekAgo.format('YYYY-MM-DD')).then((summary) => {
    const endTime: any = new Date();

    const timeDiff = (endTime - startTime) / 1000;
    Logger.info({timeDiff});

    Logger.info({summary});
    process.exit();
}).catch((err) => {
    Logger.info(err.stack);
    process.exit();
});
