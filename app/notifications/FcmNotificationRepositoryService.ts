import { chainingMethodHandlerIns } from '@app/method-handler/ChainingMethodHandler';
import { ChainingMethodParamsEntity } from '@app/method-handler/ChainingMethodParamsEntity';
import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import BaseRepositoryService from '@app/services/BaseRepositoryService';
import { FcmNotificationRepository, fcmNotificationRepositoryIns } from './FcmNotificationRepository';

export class FcmNotificationRepositoryService extends BaseRepositoryService {

    constructor(fcmNotificationRepository: FcmNotificationRepository) {
        super(fcmNotificationRepository);
    }

    public getDeviceIdsByUserIds = async (userIds: number[]) => {
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getDeviceIdsByUserIds).setParams(userIds).get();
        return result;
    }

    public getDeviceIdsOfVerifiedBuddies = async () => {
        const result = await chainingMethodHandlerIns().setNextMethodHandlerNPreserveResult(this.mRepository.getDeviceIdsOfVerifiedBuddies).setNextMethodHandlerNPreserveResult(this.extractDeviceToken).get();
        return result[1];
    }

    private extractDeviceToken = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const deviceToken = chainingMethodParamsEntity.getPreservedResultsContainerByIndex(0);
        const deviceIds = deviceToken.map((deviceId: any) => deviceId.device_token);
        return deviceIds;
    }
}

export const fcmNotificationRepositoryServiceIns = new FcmNotificationRepositoryService(fcmNotificationRepositoryIns);
