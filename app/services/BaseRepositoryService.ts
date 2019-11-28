import BaseRepository from '@app/repositories/BaseRepository';

export default class BaseRepositoryService {

    protected mRepository: any;
    constructor(mRepository: BaseRepository) {
        this.mRepository = mRepository;
    }
}
