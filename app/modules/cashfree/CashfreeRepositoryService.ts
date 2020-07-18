import { OrderStatusEnum } from '@app/enums/OrderStatusEnum';
import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import BaseRepositoryService from '@app/services/BaseRepositoryService';
import { CashfreeRepository, cashfreeRepositoryIns } from './CashfreeRepository';
import { orderRepositoryServiceIns } from '../order/OrderRepositoryService';
import { configJSONReaderHelperIns } from '../helper/ConfigJSONReaderHelper';

export class CashfreeRepositoryService extends BaseRepositoryService {

    constructor(cashfreeRepository: CashfreeRepository) {
        super(cashfreeRepository);
    }

    public logCashfreeResponse = async (orderParams) => {
        const params = { order_transaction_id: orderParams.orderId, status: orderParams.txStatus === 'SUCCESS' ? OrderStatusEnum.COMPLETED : OrderStatusEnum.FAILURE, reference_id: orderParams.referenceId, txn_status: orderParams.txStatus, response_msg: orderParams.txMsg, payment_gateway_response: JSON.stringify(orderParams) };
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.logCashfreeResponse).setParams(params).get();
        if (orderParams.txStatus === 'SUCCESS')
            orderRepositoryServiceIns.sendSMS({ orderTxnId: orderParams.orderId })
        return result;
    }

    public logCashfreeResponseNRedirect = async (orderParams) => {
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.logCashfreeResponse).setParams(orderParams).get();
        const cashfreeJson = configJSONReaderHelperIns.read('cashfree');
        const returnUrl = orderParams.txStatus === 'SUCCESS' ? cashfreeJson.webapp_sucess_return_url + '/' + orderParams.orderId : cashfreeJson.webapp_failure_return_url;
        return returnUrl;
    }

}

export const cashfreeRepositoryServiceIns = new CashfreeRepositoryService(cashfreeRepositoryIns);
