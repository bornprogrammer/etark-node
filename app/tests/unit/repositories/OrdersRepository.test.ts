import * as dotenv from 'dotenv';
dotenv.config();

import { OrdersRepository } from '@app/repositories/OrdersRepository';
import Logger from '@app/services/Logger';
import { doesNotReject } from 'assert';
import chai from 'chai';
import chatAsPromised from 'chai-as-promised';
import sinon from 'sinon';

describe('OrdersRepository tests', async () => {

    const expect = chai.expect;
    chai.use(chatAsPromised);

    it('should return all orders by buddyId, month and year', async () => {
        const ordersRepository = new OrdersRepository();
        const result = await ordersRepository.queryUserAccountAttrs();
        Logger.debug(result);
    });

});
