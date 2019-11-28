import { AirthmeticOperatorEnum } from '@app/enums/AirthmeticOperatorEnum';
import { PnsEventsName } from '@app/enums/PnsEventsName';
import { BaseEventEmitter } from '@app/events-emitter/BaseEventEmitter';
import { notificationsRepositoryServiceIns } from '@app/modules/notifications/NotificationsRepositoryService';
import { fcmNotificationFacadeIns } from '@app/notifications/FcmNotificationFacade';
import { fcmPushNotificationPayloadBuilderIns } from '@app/notifications/FcmPushNotificationPayloadBuilder';
import { FBConversationsEntityEnum } from '../FBConversationsEntityEnum';
import { FbConversationsEvents } from '../FbConversationsEvents';
import { topicRepositoryServiceIns } from '../topics/TopicRepositoryService';
import { expertRepositoryServiceIns } from './ExpertRepositoryService';
import { IExpertPointUpdateEntity } from './IExpertPointUpdateEntity';
import { FbConversationsConfiguration } from '../FbConversationsConfiguration';

class AfterExpertisePointUpdatedEventEmitter extends BaseEventEmitter {

    constructor() {
        super(FbConversationsEvents.afterExpertisePointUpdated);
    }

    public async handle(data?: IExpertPointUpdateEntity) {
        const result = await expertRepositoryServiceIns.getExpertisePointForExpert(data);
        if (result) {
            this.updateExpertiseCountForTopic(data, result);
        }
    }

    private updateExpertiseCountForTopic = async (params: IExpertPointUpdateEntity, expertiseDetail: any) => {
        const expertisePoint = expertiseDetail.expertise_point;
        /**
         * when point reduced to 19 from 20...decrement the count
         */
        if (expertisePoint === FbConversationsConfiguration.expertsCount - 1 && params.operator === AirthmeticOperatorEnum.MINUS_OPERATOR && expertiseDetail.is_expertise_claimed === 0) {
            expertRepositoryServiceIns.decrementExpertiseCountForTopic(params);
        }

        /**
         * when point raised to 20...increment the count when user hasn't claimed expertise
         */
        if (expertisePoint === FbConversationsConfiguration.expertsCount && params.operator === AirthmeticOperatorEnum.PLUS_OPERATOR && expertiseDetail.is_expertise_claimed === 0) {
            expertRepositoryServiceIns.incrementExpertiseCountForTopic(params);
            this.sendPnsWhenUserBecameExpertOnATopic(params);
        }

        /**
         * when user claim expertise
         */
        if (params.is_expertise_claimed && expertiseDetail.is_expertise_claimed > 0 && params.operator === AirthmeticOperatorEnum.PLUS_OPERATOR) {
            expertRepositoryServiceIns.incrementExpertiseCountForTopic(params);
            const params1 = { pns_event_name: PnsEventsName.PNS_TO_TOPIC_BOOKMARKED_USERS_ON_QUESTION_ASKED, user_id: params.expert_id, entity_origin_id: params.fb_conversations_topic_id, entity_type: FBConversationsEntityEnum.TOPIC };
            notificationsRepositoryServiceIns.subscribe(params1);
        }
    }

    private sendPnsWhenUserBecameExpertOnATopic = async (params) => {
        const topicDetails = await topicRepositoryServiceIns.getTopicDetailsByTopicId({ topic_id: params.fb_conversations_topic_id });
        if (topicDetails) {
            const pmsParams = fcmPushNotificationPayloadBuilderIns().setPNSName(PnsEventsName.PNS_WHEN_USER_BECAME_AN_EXPERT_ON_TOPIC).setBodyTemplateValue({ topic_name: topicDetails.topic_name }).setMultiplePayloadVal({ topic_id: topicDetails.topic_id, topic_name: topicDetails.topic_name, topic_type: topicDetails.topic_type });
            fcmNotificationFacadeIns.sendByUserIds([params.expert_id], pmsParams);
        }
    }
}

export const afterExpertisePointUpdatedEventEmitterIns = new AfterExpertisePointUpdatedEventEmitter();
