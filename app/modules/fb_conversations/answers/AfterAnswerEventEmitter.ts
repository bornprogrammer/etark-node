import { AirthmeticOperatorEnum } from '@app/enums/AirthmeticOperatorEnum';
import { PnsEventsName } from '@app/enums/PnsEventsName';
import { BaseEventEmitter } from '@app/events-emitter/BaseEventEmitter';
import { inputHelperIns } from '@app/modules/helper/InputHelper';
import { fcmNotificationFacadeIns } from '@app/notifications/FcmNotificationFacade';
import { fcmPushNotificationPayloadBuilderIns } from '@app/notifications/FcmPushNotificationPayloadBuilder';
import { AfterEntityCrudActionEnum } from '../AfterEntityCrudActionEnum';
import { FBConversationsParticipationMetricTypeEnum } from '../fb-conversations-participation/FBConversationsParticipationMetricTypeEnum';
import { fbConversationsParticipationTaskUpdatedEventEmitterIns } from '../fb-conversations-participation/FbConversationsParticipationTaskUpdatedEventEmitter';
import { IFbConversationsParticipatioQuestTaskUpdatedEntity } from '../fb-conversations-participation/IFbConversationsParticipatioQuestTaskUpdatedEntity';
import { FBConversationsEntityEnum } from '../FBConversationsEntityEnum';
import { FbConversationsEvents } from '../FbConversationsEvents';
import { answerRepositoryIns } from './AnswerRepository';

class AfterAnswerEventEmitter extends BaseEventEmitter {

    constructor() {
        super(FbConversationsEvents.afterAnswerGiven);
    }

    public async handle(answerParams: any) {
        if (inputHelperIns.isObjectValidNNotEmpty(answerParams)) {
            switch (answerParams.crud_action_type) {

                case AfterEntityCrudActionEnum.ENTITY_CRUD_ACTION_ADDED:
                    this.onAnswerAdded(answerParams);
                    break;
                case AfterEntityCrudActionEnum.ENTITY_CRUD_ACTION_DELETED:
                    this.onAnswerDeleted(answerParams);
                    break;

            }
        }
    }

    private onAnswerAdded = async (answerParams) => {
        const answerDetailsByAnswerId = await answerRepositoryIns.getAnswerDetailsByAnswerId(answerParams.answer_id);
        if (answerDetailsByAnswerId) {
            this.sendPnsToWhoBookmarkedTopicNAskedQuestions(answerParams, answerDetailsByAnswerId);
            const params1: IFbConversationsParticipatioQuestTaskUpdatedEntity = { operator: AirthmeticOperatorEnum.PLUS_OPERATOR, user_id: answerDetailsByAnswerId.question_asked_by_id, quest_task_type: FBConversationsParticipationMetricTypeEnum.CURIOUS_LUCKY_DRAW };
            fbConversationsParticipationTaskUpdatedEventEmitterIns.emit(FbConversationsEvents.afterFbConversationParticipationTaskUpdated, params1);
        }
    }

    private onAnswerDeleted = async (answerParams) => {
        const answerDetailsByAnswerId = await answerRepositoryIns.getAnswerDetailsByAnswerId(answerParams.answer_id);
        const params1: IFbConversationsParticipatioQuestTaskUpdatedEntity = { operator: AirthmeticOperatorEnum.MINUS_OPERATOR, user_id: answerDetailsByAnswerId.question_asked_by_id, quest_task_type: FBConversationsParticipationMetricTypeEnum.CURIOUS_LUCKY_DRAW };
        fbConversationsParticipationTaskUpdatedEventEmitterIns.emit(FbConversationsEvents.afterFbConversationParticipationTaskUpdated, params1);
    }

    private sendPnsToWhoBookmarkedTopicNAskedQuestions = async (answerParams: any, answerDetailsByAnswerId: any) => {
        const payload = fcmPushNotificationPayloadBuilderIns().setPNSName(PnsEventsName.PNS_TO_QUESTION_FOLLOWED_USERS_ON_ANSWER_GIVEN).setPayloadValWithCastValAsStr('question_id', answerDetailsByAnswerId.question_id).setBodyTemplateValue({ user_name: answerDetailsByAnswerId.user_name });
        fcmNotificationFacadeIns.sendByPnsEventName({ entity_origin_id: answerDetailsByAnswerId.question_id, entity_type: FBConversationsEntityEnum.QUESTION, pns_event_name: PnsEventsName.PNS_TO_QUESTION_FOLLOWED_USERS_ON_ANSWER_GIVEN }, payload);
    }

}

export const afterAnswerEventEmitterIns = new AfterAnswerEventEmitter();
