import { repositoryMethodHandlerIns } from '@app/method-handler/RepositoryMethodHandler';
import BaseRepository from '@app/repositories/BaseRepository';
import { cashfreeModelIns } from './CashfreeModel';

export class CashfreeRepository extends BaseRepository {

    constructor() {
        super();
    }

    public logCashfreeResponse = async (orderTxnId) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(cashfreeModelIns.logCashfreeResponse).setParams(orderTxnId).get();
        return result;
    }
}

export const cashfreeRepositoryIns = new CashfreeRepository();
