import { repositoryMethodHandlerIns } from '@app/method-handler/RepositoryMethodHandler';
import BaseRepository from '@app/repositories/BaseRepository';
import { INotificationSubscribedUserByEventsParamsEntity } from './INotificationSubscribedUserByEventsParamsEntity';
import { notificationsModelIns } from './NotificationsModel';

export class NotificationsRepository extends BaseRepository {

    constructor() {
        super();
    }

    public subscribe = async (params: any) => {
        return await repositoryMethodHandlerIns.setMethodHandler(notificationsModelIns.subscribe).setParams(params).get();
    }

    public unSubscribe = async (params: any) => {
        return await repositoryMethodHandlerIns.setMethodHandler(notificationsModelIns.unSubscribe).setParams(params).get();
    }

    public getNotificationSubscribedUserByEvents = async (params: INotificationSubscribedUserByEventsParamsEntity) => {
        return await repositoryMethodHandlerIns.setMethodHandler(notificationsModelIns.getNotificationSubscribedUserByEvents).setParams(params).get();
    }

    public getPhoneNoOfVerifiedBuddies = async () => {
        return await repositoryMethodHandlerIns.setMethodHandler(notificationsModelIns.getPhoneNoOfVerifiedBuddies).get();
    }
}

export const notificationsRepositoryIns = new NotificationsRepository();
