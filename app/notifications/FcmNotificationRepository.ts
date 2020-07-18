import BaseRepository from '@app/repositories/BaseRepository';
import { repositoryMethodHandlerIns } from '@app/method-handler/RepositoryMethodHandler';
import { fcmNotificationModelIns } from './FcmNotificationModel';

export class FcmNotificationRepository extends BaseRepository {

    constructor() {
        super();
    }

    public getDeviceIdsByUserIds = async (userIds: number[]) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(fcmNotificationModelIns.getDeviceIdsByUserIds).setParams(userIds).get();
        return result;
    }

    public getDeviceIdsOfVerifiedBuddies = async () => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(fcmNotificationModelIns.getDeviceIdsOfVerifiedBuddies).get();
        return result;
    }

}

export const fcmNotificationRepositoryIns = new FcmNotificationRepository();
