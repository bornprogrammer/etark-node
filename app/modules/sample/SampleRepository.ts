import SampleModel from '@app/modules/sample/SampleModel';
import BaseRepository from '@app/repositories/BaseRepository';

export default class SampleRepository extends BaseRepository {

    public create(attr: any) {
        return SampleModel.create(attr);
    }

}

export const sampleRepository = new SampleRepository();
