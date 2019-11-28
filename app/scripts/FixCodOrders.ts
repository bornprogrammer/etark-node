// this script sets the online_transaction_charges of COD orders to o
import * as dotenv from 'dotenv';
dotenv.config();

import DIContainer from '@app/DIContainer';
import Logger from '@app/services/Logger';

const ordersService = DIContainer.ordersService;

ordersService.fixPgChargesInCodOrders().then((result) => {
    Logger.info({updatedCount: result[0]});
    process.exit();
}).catch((err) => {
    Logger.info(err);
});
