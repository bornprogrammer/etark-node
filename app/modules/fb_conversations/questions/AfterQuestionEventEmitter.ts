import { PnsEventsName } from '@app/enums/PnsEventsName';
import { BaseEventEmitter } from '@app/events-emitter/BaseEventEmitter';
import { inputHelperIns } from '@app/modules/helper/InputHelper';
import { notificationsRepositoryServiceIns } from '@app/modules/notifications/NotificationsRepositoryService';
import { fcmNotificationFacadeIns } from '@app/notifications/FcmNotificationFacade';
import { fcmPushNotificationPayloadBuilderIns } from '@app/notifications/FcmPushNotificationPayloadBuilder';
import { AfterEntityCrudActionEnum } from '../AfterEntityCrudActionEnum';
import { fbConversationRepositoryServiceIns } from '../FBConversationRepositoryService';
import { FBConversationsEntityActionEnum } from '../FBConversationsEntityActionEnum';
import { FBConversationsEntityEnum } from '../FBConversationsEntityEnum';
import { FbConversationsEvents } from '../FbConversationsEvents';
import { ITopicMetadataUpdateCountEntity } from '../topics/ITopicMetadataUpdateCountEntity';
import { TopicMetadataTypeEnum } from '../topics/TopicMetadataTypeEnum';
import { questionRepositoryServiceIns } from './QuestionRepositoryService';

class AfterQuestionEventEmitter extends BaseEventEmitter {

    constructor() {
        super(FbConversationsEvents.afterQuestionAdded);
    }

    public handle(questionParams: any) {
        if (inputHelperIns.isInputValid(questionParams)) {
            switch (questionParams.crud_action_type) {
                case AfterEntityCrudActionEnum.ENTITY_CRUD_ACTION_ADDED:
                    this.onQuestionAdded(questionParams);
                    break;
                case AfterEntityCrudActionEnum.ENTITY_CRUD_ACTION_DELETED:
                    this.onQuestionRemoved(questionParams);
                    break;
            }
        }
    }

    private onQuestionAdded = async (questionParams) => {
        this.sendPnsToWhoBookmarkedTopicOnQuestionBeingAsked(questionParams);
        this.followTopic(questionParams);
        this.registerQuestionAskedUserForPNSEventsForGivenAnswer(questionParams);
        const topicMetadataUpdateCountEntityParams: ITopicMetadataUpdateCountEntity = { topicId: questionParams.topic_id, topicMetaDataType: TopicMetadataTypeEnum.QUESTIONS, count: 1 };
        fbConversationRepositoryServiceIns.incrementTopicMetadataCount(topicMetadataUpdateCountEntityParams);
    }

    private followTopic = async (questionParams) => {
        const params = { entity_type: FBConversationsEntityEnum.QUESTION, entity_action_type: FBConversationsEntityActionEnum.FOLLOWING, entity_origin_id: questionParams.question_id, user_id: questionParams.user_id };
        fbConversationRepositoryServiceIns.entityActionAdd(params);
    }

    private onQuestionRemoved = async (questionParams) => {
        const topicMetadataUpdateCountEntityParams: ITopicMetadataUpdateCountEntity = { topicId: questionParams.topic_id, topicMetaDataType: TopicMetadataTypeEnum.QUESTIONS, count: 1 };
        fbConversationRepositoryServiceIns.decrementTopicMetadataCount(topicMetadataUpdateCountEntityParams);
    }

    private sendPnsToWhoBookmarkedTopicOnQuestionBeingAsked = async (questionParams: any) => {
        const questionDetails = await questionRepositoryServiceIns.getQuestionDetails(questionParams.question_id);
        if (questionDetails) {
            const payload = fcmPushNotificationPayloadBuilderIns().setPNSName(PnsEventsName.PNS_TO_TOPIC_BOOKMARKED_USERS_ON_QUESTION_ASKED).setPayloadVal('topic_id', questionParams.topic_id).setBodyTemplateValue({ user_name: questionDetails.user_name });
            fcmNotificationFacadeIns.sendByPnsEventNameWithExcludeLoggedInUserId({ entity_origin_id: questionParams.topic_id, entity_type: FBConversationsEntityEnum.TOPIC, pns_event_name: PnsEventsName.PNS_TO_TOPIC_BOOKMARKED_USERS_ON_QUESTION_ASKED }, payload, questionDetails.created_by);
        }
    }

    private registerQuestionAskedUserForPNSEventsForGivenAnswer = async (questionParams) => {
        const params = { entity_origin_id: questionParams.question_id, entity_type: FBConversationsEntityEnum.QUESTION, pns_event_name: PnsEventsName.PNS_TO_QUESTION_FOLLOWED_USERS_ON_ANSWER_GIVEN, user_id: questionParams.user_id };
        notificationsRepositoryServiceIns.subscribe(params);
    }
}

export const afterQuestionEventEmitterIns = new AfterQuestionEventEmitter();
