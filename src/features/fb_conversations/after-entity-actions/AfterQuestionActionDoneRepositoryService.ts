import { PnsEventsName } from '@app/enums/PnsEventsName';
import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import { notificationsRepositoryServiceIns } from '@app/modules/notifications/NotificationsRepositoryService';
import { fbConversationRepositoryServiceIns } from '../FBConversationRepositoryService';
import { FbConversationsConfiguration } from '../FbConversationsConfiguration';
import { FBConversationsEntityActionEnum } from '../FBConversationsEntityActionEnum';
import { FBConversationsEntityEnum } from '../FBConversationsEntityEnum';
import { IEntity } from '../IEntity';
import { questionRepositoryIns } from '../questions/QuestionRepository';
import { questionRepositoryServiceIns } from '../questions/QuestionRepositoryService';
import { IAfterEntityActionsEntity } from './IAfterEntityActionsEntity';
import { IMarkEntitySeenEntity } from './IMarkEntitySeenEntity';

export class AfterQuestionActionDoneRepositoryService {

    public onQuestionActionAdded = (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {
        switch (iAfterEntityActionsEntityParams.entity_action_type) {
            case FBConversationsEntityActionEnum.FOLLOWING:
                this.onQuestionFollowed(iAfterEntityActionsEntityParams);
                break;
            case FBConversationsEntityActionEnum.IRRELEVANT:
                this.disableQuestionIfIrrelevantCnt3(iAfterEntityActionsEntityParams.entity_origin_id);
                break;
            case FBConversationsEntityActionEnum.REPORT:
                this.disableQuestion(iAfterEntityActionsEntityParams.entity_origin_id);
                this.deleteMarkedIrrelevantAfterReportedAbusedBySameUser(iAfterEntityActionsEntityParams);
                break;
        }
    }

    public onQuestionActionDeleted = (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {
        switch (iAfterEntityActionsEntityParams.entity_action_type) {
            case FBConversationsEntityActionEnum.FOLLOWING:
                this.onQuestionUnFollowed(iAfterEntityActionsEntityParams);
                break;
            case FBConversationsEntityActionEnum.IRRELEVANT:
                this.enableQuestionIfIrrelevantCnt2(iAfterEntityActionsEntityParams.entity_origin_id);
                break;
            case FBConversationsEntityActionEnum.REPORT:
                this.enableQuestion(iAfterEntityActionsEntityParams.entity_origin_id);
                break;
        }
    }

    public onQuestionActionSeen = (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {
        const entityData: any = iAfterEntityActionsEntityParams.entity_data;
        const params: IMarkEntitySeenEntity = { user_id: iAfterEntityActionsEntityParams.user_id, entity_action_type: iAfterEntityActionsEntityParams.entity_action_type, entity_origin_id: entityData.question_id, parent_entity_origin_id: entityData.topic_id, entity_type_id: iAfterEntityActionsEntityParams.entity_type_id };
        repositoryServiceMethodHandlerIns.setMethodHandler(fbConversationRepositoryServiceIns.markEntitySeen).setParams(params).get();
    }

    private deleteMarkedIrrelevantAfterReportedAbusedBySameUser = async (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {
        const params = { entity_type: FBConversationsEntityEnum.QUESTION, entity_action_type: FBConversationsEntityActionEnum.IRRELEVANT, entity_origin_id: iAfterEntityActionsEntityParams.entity_origin_id, user_id: iAfterEntityActionsEntityParams.user_id };
        fbConversationRepositoryServiceIns.entityActionDelete(params);
    }

    private onQuestionFollowed = async (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {
        const params = { pns_event_name: PnsEventsName.PNS_TO_QUESTION_FOLLOWED_USERS_ON_ANSWER_GIVEN, entity_origin_id: iAfterEntityActionsEntityParams.entity_origin_id, user_id: iAfterEntityActionsEntityParams.user_id, entity_type: FBConversationsEntityEnum.QUESTION };
        notificationsRepositoryServiceIns.subscribe(params);
    }

    private onQuestionUnFollowed = async (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {
        const params = { pns_event_name: PnsEventsName.PNS_TO_QUESTION_FOLLOWED_USERS_ON_ANSWER_GIVEN, entity_origin_id: iAfterEntityActionsEntityParams.entity_origin_id, user_id: iAfterEntityActionsEntityParams.user_id, entity_type: FBConversationsEntityEnum.QUESTION };
        notificationsRepositoryServiceIns.unSubscribe(params);
    }

    private disableQuestion = async (questionId) => {
        const params = { question_id: questionId };
        repositoryServiceMethodHandlerIns.setMethodHandler(questionRepositoryIns.disableQuestion).setParams(params).get();
    }

    private enableQuestion = async (questionId) => {
        const params = { question_id: questionId };
        repositoryServiceMethodHandlerIns.setMethodHandler(questionRepositoryIns.enableQuestion).setParams(params).get();
    }

    private enableQuestionIfIrrelevantCnt2 = async (questionId) => {
        const irrelevantCount = await this.getIrrelevantCountByQuestionId(questionId);
        if (irrelevantCount === (FbConversationsConfiguration.markedIrrelevantCount - 1)) {
            this.enableQuestion(questionId);
        }
    }

    private disableQuestionIfIrrelevantCnt3 = async (questionId) => {
        const irrelevantCountByQuestionId = await this.getIrrelevantCountByQuestionId(questionId);
        if (irrelevantCountByQuestionId === FbConversationsConfiguration.markedIrrelevantCount) {
            this.disableQuestion(questionId);
        }
    }

    private getIrrelevantCountByQuestionId = async (questionId) => {
        const params: IEntity = { entity_origin_id: questionId, entity_type: FBConversationsEntityEnum.QUESTION, entity_action_type: FBConversationsEntityActionEnum.IRRELEVANT };
        const irrelevantCount = await repositoryServiceMethodHandlerIns.setMethodHandler(questionRepositoryServiceIns.getIrrelevantCountByQuestionId).setParams(params).get();
        return irrelevantCount;
    }
}

export const afterQuestionActionDoneRepositoryServiceIns = new AfterQuestionActionDoneRepositoryService();
