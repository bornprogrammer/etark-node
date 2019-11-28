import { TokenNotSentError } from '@app/errors/TokenNotSentError';
import BaseRepository from '@app/repositories/BaseRepository';
import { LocalityModel, localityModelIns } from './LocalityModel';

export class LocalityRepository extends BaseRepository {

    private localityModel: LocalityModel;

    constructor(localityModel: LocalityModel) {
        super();
        this.localityModel = localityModel;
    }

    public searchLocality = async (data: any) => {
        try {
            const result = await this.localityModel.searchLocality(data);
            return result;
        } catch (error) {
            throw new TokenNotSentError();
        }
    }
}

export const localityRepositoryIns = new LocalityRepository(localityModelIns);
