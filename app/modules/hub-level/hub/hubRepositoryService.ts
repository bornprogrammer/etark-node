import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import BaseRepositoryService from '@app/services/BaseRepositoryService';
import { HubRepository, hubRepositoryIns } from './hubRepository';

export class HubRepositoryService extends BaseRepositoryService {

    constructor(hubRepository: HubRepository) {
        super(hubRepository);
    }

    public deleteUserAddedSecondaryHub = async (data: any) => {
        return await repositoryServiceMethodHandlerIns
        .setMethodHandler(this.mRepository.deleteUserAddedSecondaryHub).setParams(data).get();
    }
}

export const hubRepositoryServiceIns = new HubRepositoryService(hubRepositoryIns);
