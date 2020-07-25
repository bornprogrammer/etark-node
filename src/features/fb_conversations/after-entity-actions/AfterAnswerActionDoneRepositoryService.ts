import { AirthmeticOperatorEnum } from '@app/enums/AirthmeticOperatorEnum';
import { PnsEventsName } from '@app/enums/PnsEventsName';
import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import { inputHelperIns } from '@app/modules/helper/InputHelper';
import { fcmNotificationFacadeIns } from '@app/notifications/FcmNotificationFacade';
import { FcmPushNotificationPayloadBuilder, fcmPushNotificationPayloadBuilderIns } from '@app/notifications/FcmPushNotificationPayloadBuilder';
import { answerRepositoryIns } from '../answers/AnswerRepository';
import { answerRepositoryServiceIns } from '../answers/AnswerRepositoryService';
import { expertRepositoryServiceIns } from '../experts/ExpertRepositoryService';
import { IExpertPointUpdateEntity } from '../experts/IExpertPointUpdateEntity';
import { FBConversationsParticipationMetricTypeEnum } from '../fb-conversations-participation/FBConversationsParticipationMetricTypeEnum';
import { fbConversationsParticipationTaskUpdatedEventEmitterIns } from '../fb-conversations-participation/FbConversationsParticipationTaskUpdatedEventEmitter';
import { IFbConversationsParticipatioQuestTaskUpdatedEntity } from '../fb-conversations-participation/IFbConversationsParticipatioQuestTaskUpdatedEntity';
import { fbConversationRepositoryServiceIns } from '../FBConversationRepositoryService';
import { FbConversationsConfiguration } from '../FbConversationsConfiguration';
import { FBConversationsEntityActionEnum } from '../FBConversationsEntityActionEnum';
import { FBConversationsEntityEnum } from '../FBConversationsEntityEnum';
import { FbConversationsEvents } from '../FbConversationsEvents';
import { IEntity } from '../IEntity';
import { IAfterEntityActionsEntity } from './IAfterEntityActionsEntity';
import { IMarkEntitySeenEntity } from './IMarkEntitySeenEntity';

export class AfterAnswerActionDoneRepositoryService {

    public onAnswerActionAdded = (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {
        switch (iAfterEntityActionsEntityParams.entity_action_type) {
            case FBConversationsEntityActionEnum.UPVOTES:
                this.onAnswerUpvoted(iAfterEntityActionsEntityParams);
                break;
            case FBConversationsEntityActionEnum.IRRELEVANT:
                this.disableAnswerIfIrrelevantCnt3(iAfterEntityActionsEntityParams.entity_origin_id);
                break;
            case FBConversationsEntityActionEnum.REPORT:
                this.disableAnswer(iAfterEntityActionsEntityParams.entity_origin_id);
                this.deleteMarkedIrrelevantAfterReportedAbusedBySameUser(iAfterEntityActionsEntityParams);
                break;
        }
    }

    public onAnswerActionSeen = (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {
        const entityData: any = iAfterEntityActionsEntityParams.entity_data;
        const recentAnswerObj = this.getRecentAnswerIdForMarkLastSeen(entityData);
        if (inputHelperIns.isArrayValidNNotEmpty(entityData) && entityData[0].followed_by && inputHelperIns.isObjectValidNNotEmpty(recentAnswerObj)) {
            // tslint:disable-next-line: max-line-length
            const params: IMarkEntitySeenEntity = { user_id: iAfterEntityActionsEntityParams.user_id, entity_action_type: iAfterEntityActionsEntityParams.entity_action_type, entity_origin_id: recentAnswerObj.answer_id, parent_entity_origin_id: recentAnswerObj.question_id, entity_type_id: iAfterEntityActionsEntityParams.entity_type_id };
            repositoryServiceMethodHandlerIns.setMethodHandler(fbConversationRepositoryServiceIns.markEntitySeen).setParams(params).get();
        }
    }

    public onAnswerActionDeleted = (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {
        switch (iAfterEntityActionsEntityParams.entity_action_type) {
            case FBConversationsEntityActionEnum.UPVOTES:
                this.onAnswerDownvoted(iAfterEntityActionsEntityParams.entity_origin_id);
                break;
            case FBConversationsEntityActionEnum.IRRELEVANT:
                this.enableAnswerIfIrrelevantCnt2(iAfterEntityActionsEntityParams.entity_origin_id);
                break;
            case FBConversationsEntityActionEnum.REPORT:
                this.enableAnswer(iAfterEntityActionsEntityParams.entity_origin_id);
                break;
        }
    }

    private onAnswerDownvoted = async (answerId) => {
        const answerDetailsByAnswerId = await this.getAnswerDetailsByAnswerId(answerId);
        if (answerDetailsByAnswerId) {
            const params = this.buildParamsForUpdatingExpertisePoints(answerDetailsByAnswerId);
            repositoryServiceMethodHandlerIns.setMethodHandler(expertRepositoryServiceIns.decrementExpertisePoint).setParams(params).get();

            const params1: IFbConversationsParticipatioQuestTaskUpdatedEntity = { operator: AirthmeticOperatorEnum.MINUS_OPERATOR, user_id: params.expert_id, quest_task_type: FBConversationsParticipationMetricTypeEnum.EXPERTS_LUCKY_DRAW };
            fbConversationsParticipationTaskUpdatedEventEmitterIns.emit(FbConversationsEvents.afterFbConversationParticipationTaskUpdated, params1);
        }
    }

    /**
     * will delete the irrelevant in case of reported abused when user already marked irrelevant
     */
    private deleteMarkedIrrelevantAfterReportedAbusedBySameUser = async (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {
        const params = { entity_type: FBConversationsEntityEnum.ANSWER, entity_action_type: FBConversationsEntityActionEnum.IRRELEVANT, entity_origin_id: iAfterEntityActionsEntityParams.entity_origin_id, user_id: iAfterEntityActionsEntityParams.user_id };
        fbConversationRepositoryServiceIns.entityActionDelete(params);
    }

    private onAnswerUpvoted = async (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {
        const answerDetailsByAnswerId = await this.getAnswerDetailsByAnswerId(iAfterEntityActionsEntityParams.entity_origin_id);
        if (answerDetailsByAnswerId) {
            const params = this.buildParamsForUpdatingExpertisePoints(answerDetailsByAnswerId);
            repositoryServiceMethodHandlerIns.setMethodHandler(expertRepositoryServiceIns.incrementExpertisePoint).setParams(params).get();

            this.sendNotificationsOnAnswerUpvoted(answerDetailsByAnswerId, iAfterEntityActionsEntityParams.user_id);

            const params1: IFbConversationsParticipatioQuestTaskUpdatedEntity = { operator: AirthmeticOperatorEnum.PLUS_OPERATOR, user_id: params.expert_id, quest_task_type: FBConversationsParticipationMetricTypeEnum.EXPERTS_LUCKY_DRAW };
            fbConversationsParticipationTaskUpdatedEventEmitterIns.emit(FbConversationsEvents.afterFbConversationParticipationTaskUpdated, params1);
        }
    }

    private sendNotificationsOnAnswerUpvoted = async (params, userId) => {
        params.user_id = userId;
        const userDetails = await answerRepositoryIns.getUserDetailsWhoUpvotedAnswer(params);
        const fcmBuilderParams: FcmPushNotificationPayloadBuilder = fcmPushNotificationPayloadBuilderIns().setPNSName(PnsEventsName.PNS_TO_ANSWER_OWNER_WHEN_UPVOTED).setPayloadValWithCastValAsStr('answer_id', params.answer_id).setPayloadValWithCastValAsStr('question_id', params.question_id).setBodyTemplateValue({ topic_name: params.topic_name, user_name: userDetails.user_name });
        fcmNotificationFacadeIns.sendByUserIds([params.answered_by], fcmBuilderParams);
    }

    private getAnswerDetailsByAnswerId = async (answerId) => {
        return await repositoryServiceMethodHandlerIns.setMethodHandler(answerRepositoryIns.getAnswerDetailsByAnswerId).setParams(answerId).get();
    }

    private getRecentAnswerIdForMarkLastSeen = (answerList: any) => {
        let answerObj = answerList[0];
        if (answerObj) {
            answerList.forEach((item) => {
                if (item.answer_id !== answerObj.answer_id) {
                    answerObj = item.answer_id > answerObj.answer_id ? item : answerObj;
                    return answerObj;
                }
            });
        }
        return answerObj;
    }

    private buildParamsForUpdatingExpertisePoints = (answerDetails: any) => {
        const iExpertPointUpdateEntityParams: IExpertPointUpdateEntity = {
            fb_conversations_topic_id: answerDetails.topic_id,
            expert_id: answerDetails.answered_by,
        };
        return iExpertPointUpdateEntityParams;
    }

    private disableAnswer = async (answerId) => {
        const params = { answer_id: answerId };
        repositoryServiceMethodHandlerIns.setMethodHandler(answerRepositoryIns.disableAnswer).setParams(params).get();
    }

    private enableAnswer = async (answerId) => {
        const params = { answer_id: answerId };
        repositoryServiceMethodHandlerIns.setMethodHandler(answerRepositoryIns.enableAnswer).setParams(params).get();
    }

    private disableAnswerIfIrrelevantCnt3 = async (answerId) => {
        const irrelevantCount = await this.getIrrelevantCountByAnsId(answerId);
        if (irrelevantCount === FbConversationsConfiguration.markedIrrelevantCount) {
            this.disableAnswer(answerId);
        }
    }

    private enableAnswerIfIrrelevantCnt2 = async (answerId) => {
        const irrelevantCount = await this.getIrrelevantCountByAnsId(answerId);
        if (irrelevantCount === (FbConversationsConfiguration.markedIrrelevantCount - 1)) {
            this.enableAnswer(answerId);
        }
    }

    private getIrrelevantCountByAnsId = async (answerId) => {
        const params: IEntity = { entity_origin_id: answerId, entity_type: FBConversationsEntityEnum.ANSWER, entity_action_type: FBConversationsEntityActionEnum.IRRELEVANT };
        const irrelevantCount = await repositoryServiceMethodHandlerIns.setMethodHandler(answerRepositoryServiceIns.getIrrelevantCountByAnsId).setParams(params).get();
        return irrelevantCount;
    }
}

export const afterAnswerActionDoneRepositoryServiceIns = new AfterAnswerActionDoneRepositoryService();
