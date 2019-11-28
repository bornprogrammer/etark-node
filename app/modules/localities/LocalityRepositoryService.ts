import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import BaseRepositoryService from '@app/services/BaseRepositoryService';
import { LocalityRepository, localityRepositoryIns } from './LocalityRepository';

export class LocalityRepositoryService extends BaseRepositoryService {

    constructor(localityRepository: LocalityRepository) {
        super(localityRepository);
    }

    public searchLocality = async (data: any) => {
        return await repositoryServiceMethodHandlerIns
        .setMethodHandler(this.mRepository.searchLocality).setParams(data).get();
    }
}

export const localityRepositoryServiceIns = new LocalityRepositoryService(localityRepositoryIns);
