import { chainingMethodHandlerIns } from '@app/method-handler/ChainingMethodHandler';
import { ChainingMethodParamsEntity } from '@app/method-handler/ChainingMethodParamsEntity';
import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import { inputHelperIns } from '@app/modules/helper/InputHelper';
import BaseRepositoryService from '@app/services/BaseRepositoryService';
import { afterEntityActionsEventEmitterIns } from '../after-entity-actions/AfterEntityActionsEventEmitter';
import { IAfterEntityActionsEntity } from '../after-entity-actions/IAfterEntityActionsEntity';
import { AfterEntityCrudActionEnum } from '../AfterEntityCrudActionEnum';
import { fbConversationRepositoryIns } from '../FBConversationRepository';
import { FBConversationsEntityActionEnum } from '../FBConversationsEntityActionEnum';
import { FBConversationsEntityEnum } from '../FBConversationsEntityEnum';
import { FbConversationsEvents } from '../FbConversationsEvents';
import { afterQuestionEventEmitterIns } from './AfterQuestionEventEmitter';
import { QuestionRepository, questionRepositoryIns } from './QuestionRepository';
import { IEntity } from '../IEntity';
import { fcmNotificationFacadeIns } from '@app/notifications/FcmNotificationFacade';
import { FcmPushNotificationPayloadBuilder, fcmPushNotificationPayloadBuilderIns } from '@app/notifications/FcmPushNotificationPayloadBuilder';
import { PnsEventsName } from '@app/enums/PnsEventsName';

export class QuestionRepositoryService extends BaseRepositoryService {

    constructor(questionRepository: QuestionRepository) {
        super(questionRepository);
    }

    public addQuestion = async (params) => {
        const result = await chainingMethodHandlerIns().setNextMethodHandlerNPreserveResult(this.mRepository.addQuestion, params).get();
        params.question_id = result[0];
        params.topicId = params.topic_id;
        params.user_id = params.user_id;
        params.crud_action_type = AfterEntityCrudActionEnum.ENTITY_CRUD_ACTION_ADDED;
        afterQuestionEventEmitterIns.emit(FbConversationsEvents.afterQuestionAdded, params);
        return { question_id: result[0] };
    }

    public updateQuestion = async (params) => {
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.updateQuestion).setParams(params).get();
        return result;
    }

    public deleteQuestion = async (params) => {
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.deleteQuestion).setParams(params).get();
        params.crud_action_type = AfterEntityCrudActionEnum.ENTITY_CRUD_ACTION_DELETED;
        params.topicId = params.topic_id;
        afterQuestionEventEmitterIns.emit(FbConversationsEvents.afterQuestionAdded, params);
        return result;
    }

    public getQuestionFillers = async () => {
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getQuestionFillers).get();
        return result;
    }

    public getQuestionDetails = async (questionId: any) => {
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getQuestionDetails).setParams(questionId).get();
        return result;
    }

    // public incrementTopicMetadataCount = async (params: ITopicMetadataUpdateCountEntity) => {
    //     const result = await repositoryServiceMethodHandlerIns.setMethodHandler(fbConversationRepositoryIns.incrementTopicMetadataCount).setParams(params).get();
    //     return result;
    // }

    public getQuestionList = async (params) => {
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getQuestionList).setParams(params).get();
        return result;
    }

    public getQuestionWithMostVotedAnswers = async (params) => {
        const result = await chainingMethodHandlerIns().setNextMethodHandlerNPreserveResult(fbConversationRepositoryIns.getEntityNActionID, params).setNextMethodHandlerNPreserveResult(this.getAnotherEntityNActionID).setNextMethodHandlerNPreserveResult(this.mRepository.getQuestionWithMostVotedAnswers).setNextMethodHandler(this.afterQuestionSeen).get();
        return result[2];
    }

    public getQuestionsFollowedByYou = async (params) => {
        const result = await chainingMethodHandlerIns()
            .setNextMethodHandlerNPreserveResult(fbConversationRepositoryIns.getEntityNActionID, params)
            .setNextMethodHandler(this.mRepository.getQuestionsFollowedByYou).get();
        return result[1];
    }

    public getQuestionsOfTopicYouAreExpertIn = async (params) => {
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getQuestionsOfTopicYouAreExpertIn).setParams(params).get();
        return result;
    }

    public askQuestion = async (data: any) => {
        const result = await repositoryServiceMethodHandlerIns
            .setMethodHandler(this.mRepository.askQuestion).setParams(data).get();
        return result;
    }

    public getUnAnsweredQuestionCount = async () => {
        const result = await repositoryServiceMethodHandlerIns
            .setMethodHandler(this.mRepository.getUnAnsweredQuestionCount).get();
        return result;
    }

    public getIrrelevantCountByQuestionId = async (params: IEntity) => {
        const result = await chainingMethodHandlerIns().setNextMethodHandlerNPreserveResult(fbConversationRepositoryIns.getEntityNActionID, params).setNextMethodHandlerNPreserveResult(this.mRepository.getIrrelevantCountByQuestionId).get();
        return result[1];
    }

    public getMostResponsedQuestion = async () => {
        const result = await chainingMethodHandlerIns().setNextMethodHandler(this.mRepository.getMostResponsedQuestion).setNextMethodHandler(this.sendPnsForMostResponsedQuestion).get();
        return result;
    }

    private sendPnsForMostResponsedQuestion = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const params = chainingMethodParamsEntity.getResult();
        const title = `${params.name} has a question on ${params.topic_name}`;
        const pnsParams = fcmPushNotificationPayloadBuilderIns().setMessage(params.question).setPNSName(PnsEventsName.PNS__DAILY_TO_BUDDIES_OF_TOP_RESPONSED_QUESTION).setPayloadValWithCastValAsStr('question_id', params.question_id).setTitle(title);
        fcmNotificationFacadeIns.sendToVerifiedBudies(pnsParams);
    }

    private getAnotherEntityNActionID = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const params = { entity_type: FBConversationsEntityEnum.QUESTION, entity_action_type: FBConversationsEntityActionEnum.UPVOTES };
        const answerEntityTypeDetails = chainingMethodParamsEntity.getPreservedResultsContainerByIndex(0);
        const result = await chainingMethodHandlerIns().setNextMethodHandler(fbConversationRepositoryIns.getEntityNActionID, params).get();
        const result1 = { entity_upvotes_action_type_id: result[0].entity_action_type_id, answer_entity_type_id: answerEntityTypeDetails.entity_type_id, question_entity_type_id: result[0].entity_type_id };
        return result1;
    }

    private afterQuestionSeen = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const topParams = chainingMethodParamsEntity.getTopParams();
        const entityTypeDetails = chainingMethodParamsEntity.getPreservedResultsContainerByIndex(1);
        const questionList = chainingMethodParamsEntity.getPreservedResultsContainerByIndex(2);
        const recentQuestionObj = this.getLatestQuestionFromQuestionList(questionList);
        const params: IAfterEntityActionsEntity = {
            crud_action_type: AfterEntityCrudActionEnum.ENTITY_CRUD_ACTION_SEEN, user_id: topParams.user_id, entity_type: FBConversationsEntityEnum.QUESTION, entity_type_id: entityTypeDetails.question_entity_type_id, entity_data: recentQuestionObj,
        };
        afterEntityActionsEventEmitterIns.emit(FbConversationsEvents.afterEntityActions, params);
    }

    private getLatestQuestionFromQuestionList = (questionList: any) => {
        let questionObj = null;
        if (inputHelperIns.isArrayValidNNotEmpty(questionList)) {
            questionObj = questionList[0];
            questionList.forEach((item) => {
                if (item.question_id > questionObj.question_id) {
                    questionObj = item;
                }
            });
        }
        return questionObj;
    }

}

export const questionRepositoryServiceIns = new QuestionRepositoryService(questionRepositoryIns);
