import { INotificationSubscribedUserByEventsParamsEntity } from '@app/modules/notifications/INotificationSubscribedUserByEventsParamsEntity';
import { notificationsRepositoryServiceIns } from '@app/modules/notifications/NotificationsRepositoryService';
import { fcmNotificationRepositoryServiceIns } from './FcmNotificationRepositoryService';
import { fcmPushNotficationServiceIns } from './FcmPushNotficationService';
import { FcmPushNotificationPayloadBuilder } from './FcmPushNotificationPayloadBuilder';
import ArrayHelper from '@app/modules/helper/ArrayHelper';
import { inputHelperIns } from '@app/modules/helper/InputHelper';

class FcmNotificationFacade {

    public sendByUserIds = async (userIds: number[], fcmPushNotificationPayloadBuilder: FcmPushNotificationPayloadBuilder) => {
        let deviceIds = await fcmNotificationRepositoryServiceIns.getDeviceIdsByUserIds(userIds);
        deviceIds = deviceIds.map((deviceId: any) => deviceId.device_token);
        fcmPushNotficationServiceIns.send(deviceIds, fcmPushNotificationPayloadBuilder.build());
    }

    public sendToVerifiedBudies = async (fcmPushNotificationPayloadBuilder: FcmPushNotificationPayloadBuilder) => {
        const deviceIds = await fcmNotificationRepositoryServiceIns.getDeviceIdsOfVerifiedBuddies();
        fcmPushNotficationServiceIns.send(deviceIds, fcmPushNotificationPayloadBuilder.build());
    }

    public sendByUserIdsNPayload = async (userIds: number[], payload: any) => {
        let deviceIds = await fcmNotificationRepositoryServiceIns.getDeviceIdsByUserIds(userIds);
        deviceIds = deviceIds.map((deviceId: any) => deviceId.device_token);
        fcmPushNotficationServiceIns.send(deviceIds, payload);
    }

    // pnsEventName: PnsEventsName, fcmPushNotificationPayloadBuilder: FcmPushNotificationPayloadBuilder
    public sendByPnsEventName = async (params: INotificationSubscribedUserByEventsParamsEntity, fcmPushNotificationPayloadBuilder: FcmPushNotificationPayloadBuilder) => {
        let userIds = await notificationsRepositoryServiceIns.getNotificationSubscribedUserByEvents(params);
        if (userIds) {
            this.sendByUserIds(this.extractUserIds(userIds), fcmPushNotificationPayloadBuilder);
        }
    }

    public sendByPnsEventNameWithExcludeLoggedInUserId = async (params: INotificationSubscribedUserByEventsParamsEntity, fcmPushNotificationPayloadBuilder: FcmPushNotificationPayloadBuilder, excludeUserId) => {
        let userIds = await notificationsRepositoryServiceIns.getNotificationSubscribedUserByEvents(params);
        if (userIds) {
            userIds = this.extractUserIdsWithExcludeId(userIds, excludeUserId);
            // userIds = this.extractUserIdsWithExcludeId([{ user_id: 17254 }, { user_id: 44338 }], 44338);
            this.sendByUserIds(userIds, fcmPushNotificationPayloadBuilder);
        }
    }

    public extractUserIds = (userIds) => {
        userIds = userIds.map((userId) => userId.user_id);
        return userIds;
    }

    public extractUserIdsWithExcludeId = (userIds, excludeUserId) => {
        const filteredUserIds = [];
        if (inputHelperIns.isArrayValidNNotEmpty(userIds)) {
            userIds.forEach((userId) => {
                if (userId.user_id !== excludeUserId) {
                    filteredUserIds.push(userId.user_id);
                }
            });
        }
        return filteredUserIds;
    }
}

export const fcmNotificationFacadeIns = new FcmNotificationFacade();
