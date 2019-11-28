import ExpectationFailedError from '@app/errors/ExpectationFailedError';
import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import BaseRepositoryService from '@app/services/BaseRepositoryService';
import { ShippingRepository, shippingRepositoryIns } from './ShippingRepository';

class ShippingRepositoryService extends BaseRepositoryService {

    constructor(shippingRepository: ShippingRepository) {
        super(shippingRepository);
    }

    public addShippingAddress = async (params) => {
        const shippingAddressParams = { user_id: params.user_id, door_no: params.door_no, street: params.street, locality: params.locality, landmark: params.landmark, pincode: params.pincode, city: params.city, state: params.state, order_id: params.order_id };
        const result = await repositoryServiceMethodHandlerIns.setParams(shippingAddressParams).setMethodHandler(this.mRepository.addShippingAddress).get();
        if (!result) {
            throw new ExpectationFailedError();
        }
        return result;
    }

    public addEAddress = async (eAddressParams) => {
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.addEAddress).setParams(eAddressParams).get();
        return result;
    }
}
export const shippingRepositoryServiceIns = new ShippingRepositoryService(shippingRepositoryIns);
