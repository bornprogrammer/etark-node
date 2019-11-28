import { repositoryMethodHandlerIns } from '@app/method-handler/RepositoryMethodHandler';
import BaseRepository from '@app/repositories/BaseRepository';
import { shippingModelIns } from './ShippingModel';

export class ShippingRepository extends BaseRepository {
    constructor() {
        super();
    }

    public addShippingAddress = async (params) => {
        const shippingAddress = await repositoryMethodHandlerIns.setParams(params).setMethodHandler(shippingModelIns.addShippingAddress).get();
        return shippingAddress;
    }

    public addEAddress = async (eAddressParams) => {
        const eAddressResult = await repositoryMethodHandlerIns.setMethodHandler(shippingModelIns.addEAddress).setParams(eAddressParams).get();
        return eAddressResult;
    }
}

export const shippingRepositoryIns = new ShippingRepository();
