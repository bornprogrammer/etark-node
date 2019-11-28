import { repositoryMethodHandlerIns } from '@app/method-handler/RepositoryMethodHandler';
import BaseRepository from '@app/repositories/BaseRepository';
import { orderFailureModelIns } from './OrderFailureModel';
import { ChainingMethodParamsEntity } from '@app/method-handler/ChainingMethodParamsEntity';

export class OrderFailureRepository extends BaseRepository {

    constructor() {
        super();
    }

    public getPendingOrders = async () => {
        const foodyQuestTaskDetails = await repositoryMethodHandlerIns.setMethodHandler(orderFailureModelIns.getPendingOrders).get();
        return foodyQuestTaskDetails;
    }

}

export const orderFailureRepositoryIns = new OrderFailureRepository();
