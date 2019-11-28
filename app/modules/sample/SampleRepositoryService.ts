
import ArrayHelper from '@app/modules/helper/ArrayHelper';
import ObjectHelper from '@app/modules/helper/ObjectHelper';
import SampleRepository, { sampleRepository } from '@app/modules/sample/SampleRepository';
import BaseRepositoryService from '@app/services/BaseRepositoryService';

export default class SampleRepositoryService extends BaseRepositoryService {

    constructor(sampleRepository: SampleRepository ) {
        super(sampleRepository);
    }

    public create = async () => {

    }

}

export let sampleRepositoryService = new SampleRepositoryService(sampleRepository);
