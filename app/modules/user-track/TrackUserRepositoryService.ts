import { TrackUserActionEnum } from '@app/enums/TrackUserActionEnum';
import { TrackUserEventEnum } from '@app/enums/TrackUserEventEnum';
import CustomError from '@app/errors/CustomError';
import ExpectationFailedError from '@app/errors/ExpectationFailedError';
import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import AppMiddlewareBootstrapper from '@app/middleware-bootstrapper/AppMiddlewareBootstrapper';
import BaseRepositoryService from '@app/services/BaseRepositoryService';
import { TrackUserRepository, trackUserRepositoryIns } from './TrackUserRepository';

export class TrackUserRepositoryService extends BaseRepositoryService {

    constructor(trackUserRepository: TrackUserRepository) {
        super(trackUserRepository);
    }

    public updateBannerCount = async (obj: any) => {
        console.log('BANNER', obj);
        return await repositoryServiceMethodHandlerIns
            .setMethodHandler(this.mRepository.updateBannerCount).setParams({
                userId: obj.userId,
                origin: TrackUserEventEnum.BANNER,
                actionId: TrackUserActionEnum.CLICK,
                originId: obj.banner_id,

            }).get();
    }

}

export const trackUserRepositoryServiceIns = new TrackUserRepositoryService(trackUserRepositoryIns);
