import { TokenNotSentError } from '@app/errors/TokenNotSentError';
import { repositoryMethodHandlerIns } from '@app/method-handler/RepositoryMethodHandler';
import BaseRepository from '@app/repositories/BaseRepository';
import { TrackUserModel, trackUserModelIns } from './TrackUserModel';

export class TrackUserRepository extends BaseRepository {

    private trackUserModel: TrackUserModel;

    constructor(trackUserModel: TrackUserModel) {
        super();
        this.trackUserModel = trackUserModel;
    }

    public updateBannerCount = async (obj) => {
        return await repositoryMethodHandlerIns.setParams(obj)
            .setMethodHandler(this.trackUserModel.updateBannerCount).get();
    }
}

export const trackUserRepositoryIns = new TrackUserRepository(trackUserModelIns);
