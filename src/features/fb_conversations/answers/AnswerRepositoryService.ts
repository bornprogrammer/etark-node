import { chainingMethodHandlerIns } from '@app/method-handler/ChainingMethodHandler';
import { ChainingMethodParamsEntity } from '@app/method-handler/ChainingMethodParamsEntity';
import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import BaseRepositoryService from '@app/services/BaseRepository';
import { afterEntityActionsEventEmitterIns } from '../after-entity-actions/AfterEntityActionsEventEmitter';
import { IAfterEntityActionsEntity } from '../after-entity-actions/IAfterEntityActionsEntity';
import { AfterEntityCrudActionEnum } from '../AfterEntityCrudActionEnum';
import { fbConversationRepositoryIns } from '../FBConversationRepository';
// tslint:disable-next-line: ordered-imports
import { FBConversationsEntityActionEnum } from '../FBConversationsEntityActionEnum';
import { FBConversationsEntityEnum } from '../FBConversationsEntityEnum';
// tslint:disable-next-line: ordered-imports
import { FbConversationsEvents } from '../FbConversationsEvents';
import { questionRepositoryServiceIns } from '../questions/QuestionRepositoryService';
import { afterAnswerEventEmitterIns } from './AfterAnswerEventEmitter';
import { AnswerRepository, answerRepositoryIns } from './AnswerRepository';
import { IEntity } from '../IEntity';
import { fbConversationRepositoryServiceIns } from '../FBConversationRepositoryService';

export class AnswerRepositoryService extends BaseRepositoryService {

    constructor(answerRepository: AnswerRepository) {
        super(answerRepository);
    }

    public addAnswer = async (params) => {
        const result = await chainingMethodHandlerIns().setNextMethodHandlerNPreserveResult(this.mRepository.addAnswer, params).get();
        params.answer_id = result[0];
        params.crud_action_type = AfterEntityCrudActionEnum.ENTITY_CRUD_ACTION_ADDED;
        afterAnswerEventEmitterIns.emit(FbConversationsEvents.afterAnswerGiven, params);
        return { answer_id: result[0] };
    }

    public updateAnswer = async (params) => {
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.updateAnswer).setParams(params).get();
        return result;
    }

    public deleteAnswer = async (params) => {
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.deleteAnswer).setParams(params).get();
        params.crud_action_type = AfterEntityCrudActionEnum.ENTITY_CRUD_ACTION_DELETED;
        afterAnswerEventEmitterIns.emit(FbConversationsEvents.afterAnswerGiven, params);
        return result;
    }

    public getAnswerList = async (params) => {
        // tslint:disable-next-line: max-line-length
        const result = await chainingMethodHandlerIns().setNextMethodHandlerNPreserveResult(fbConversationRepositoryIns.getEntityNActionID, params).setNextMethodHandlerNPreserveResult(this.getAnotherEntityNActionID).setNextMethodHandlerNPreserveResult(this.getQuestionDetails, params.question_id).setNextMethodHandlerNPreserveResult(this.mRepository.getAnswerList).setNextMethodHandler(this.afterAnswerSeen).get();
        return result[3];
    }

    public getAnswerNQuestionByQuestionId = async (params) => {
        const result = await chainingMethodHandlerIns().setNextMethodHandlerNPreserveResult(fbConversationRepositoryIns.getEntityNActionID, params).setNextMethodHandlerNPreserveResult(this.getAnotherEntityNActionID).setNextMethodHandler(this.mRepository.getAnswerNQuestionByQuestionId).setParams(params).get();
        return result[2];
    }

    public getAnswersGivenByYou = async (params) => {
        const result = await chainingMethodHandlerIns().setNextMethodHandlerNPreserveResult(fbConversationRepositoryIns.getEntityNActionID, params).setNextMethodHandler(this.mRepository.getAnswersGivenByYou).get();
        return result[1];
    }

    public getIrrelevantCountByAnsId = async (params: IEntity) => {
        const result = await chainingMethodHandlerIns().setNextMethodHandlerNPreserveResult(fbConversationRepositoryIns.getEntityNActionID, params).setNextMethodHandlerNPreserveResult(this.mRepository.getIrrelevantCountByAnsId).get();
        return result;
    }

    private getQuestionDetails = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const params = chainingMethodParamsEntity.getMethodParams();
        return await questionRepositoryServiceIns.getQuestionDetails(params);
    }

    private afterAnswerSeen = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const topParams = chainingMethodParamsEntity.getTopParams();
        Object.assign(topParams, chainingMethodParamsEntity.getPreservedResultsContainerByIndex(0));
        const answerList = chainingMethodParamsEntity.getPreservedResultsContainerByIndex(3);
        const params: IAfterEntityActionsEntity = {
            crud_action_type: AfterEntityCrudActionEnum.ENTITY_CRUD_ACTION_SEEN, entity_data: answerList, user_id: topParams.user_id, entity_type: topParams.entity_type, entity_type_id: topParams.entity_type_id,
        };
        afterEntityActionsEventEmitterIns.emit(FbConversationsEvents.afterEntityActions, params);
    }

    private getAnotherEntityNActionID = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const params = { entity_type: FBConversationsEntityEnum.ANSWER, entity_action_type: FBConversationsEntityActionEnum.UPVOTES };
        const result = await chainingMethodHandlerIns().setNextMethodHandler(fbConversationRepositoryIns.getEntityNActionID, params).get();
        const result1 = { entity_upvotes_action_type_id: result[0].entity_action_type_id, answer_entity_type_id: result[0].entity_type_id };
        return result1;
    }

}

export const answerRepositoryServiceIns = new AnswerRepositoryService(answerRepositoryIns);
