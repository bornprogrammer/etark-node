import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import BaseRepositoryService from '@app/services/BaseRepositoryService';
import { INotificationSubscribedUserByEventsParamsEntity } from './INotificationSubscribedUserByEventsParamsEntity';
import { NotificationsRepository, notificationsRepositoryIns } from './NotificationsRepository';
import { topicRepositoryServiceIns } from '../fb_conversations/topics/TopicRepositoryService';
import { DateHelper } from '../helper/DateHelper';
import { fcmPushNotificationPayloadBuilderIns } from '@app/notifications/FcmPushNotificationPayloadBuilder';
import { PnsEventsName } from '@app/enums/PnsEventsName';
import { fcmNotificationFacadeIns } from '@app/notifications/FcmNotificationFacade';
import { smsFactoryIns } from '@app/sms/SmsFactory';
import { FbConversationsConfiguration } from '../fb_conversations/FbConversationsConfiguration';

export class NotificationsRepositoryService extends BaseRepositoryService {

    constructor(notificationsRepository: NotificationsRepository) {
        super(notificationsRepository);
    }

    public subscribe = async (params: any) => {
        return await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.subscribe).setParams(params).get();
    }

    public getNotificationSubscribedUserByEvents = async (params: INotificationSubscribedUserByEventsParamsEntity) => {
        return await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getNotificationSubscribedUserByEvents).setParams(params).get();
    }

    public unSubscribe = async (params: any) => {
        return await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.unSubscribe).setParams(params).get();
    }

    /**
     * will send the notification to sendNotificationToVerifiedBuddiesForNewTopicCreationUpdate weekly by cron
     */
    public sendNotificationToVerifiedBuddiesForNewTopicCreationUpdate = async () => {
        const topicCount = await topicRepositoryServiceIns.getTopicCount({ curdate: DateHelper.getCurrentUTCDateTimeAsMysqlStr() });
        if (topicCount > 0) {
            const params = fcmPushNotificationPayloadBuilderIns().setBodyTemplateValue({ new_topic_count: topicCount }).setPNSName(PnsEventsName.PNS__WEEKLY_WHEN_NEW_TOPIC_CREATED);
            fcmNotificationFacadeIns.sendToVerifiedBudies(params);
        }
    }

    /**
     * will send the notification to sendSMSToVerifiedBuddiesForNewTopicCreationUpdate weekly by cron
     */
    public sendSMSToVerifiedBuddiesForNewTopicCreationUpdate = async () => {
        const topicCount = await topicRepositoryServiceIns.getTopicCount({ curdate: DateHelper.getCurrentUTCDateTimeAsMysqlStr() });
        if (topicCount > 0) {
            let phoneNoOfVerifiedBuddies = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getPhoneNoOfVerifiedBuddies).get();
            phoneNoOfVerifiedBuddies = phoneNoOfVerifiedBuddies.map((phoneNoDetails: any) => phoneNoDetails.user_phone);
            phoneNoOfVerifiedBuddies = phoneNoOfVerifiedBuddies.join();
            const message = `${topicCount} new topics added for discussion in the last week, share your expertise on food with the FoodyBuddy community and win rewards! ${FbConversationsConfiguration.newTopicCreationSmsBodyUrl}`;
            smsFactoryIns.send({ mobile_number: phoneNoOfVerifiedBuddies, message });
        }
    }

    public sendSms = async (params) => {
        const phoneNoOfVerifiedBuddies = params.phone.join();
        const message = params.message;
        smsFactoryIns.send({ mobile_number: phoneNoOfVerifiedBuddies, message });
    }
}

export const notificationsRepositoryServiceIns = new NotificationsRepositoryService(notificationsRepositoryIns);
