import ErrorFactory from '@app/errors/ErrorFactory';
import PrivateKitchenConstants from '@app/modules/private-kitchen/PrivateKitchenConstants';
import PrivateKitchenRepository, { privateKitchenRepository } from '@app/modules/private-kitchen/PrivateKitchenRepository';
import BaseRepositoryService from '@app/services/BaseRepositoryService';

export default class PrivateKitchenRepositoryService extends BaseRepositoryService {

    constructor(privateKitchenRepository: PrivateKitchenRepository) {
        super(privateKitchenRepository);
    }

    public isCashOnly = async (pkId) => {
        try {
            let cashOnly: boolean;
            const type = await this.mRepository.getType(pkId);

            if (type === PrivateKitchenConstants.type.CASH_ONLY_KITCHEN) {
                cashOnly = true;
            } else {
                cashOnly = false;
            }
            return cashOnly;
        } catch (error) {
            throw new ErrorFactory(error);
        }

    }

}

export const privateKitchenRepositoryService = new PrivateKitchenRepositoryService(privateKitchenRepository);
