import { AirthmeticOperatorEnum } from '@app/enums/AirthmeticOperatorEnum';
import { chainingMethodHandlerIns } from '@app/method-handler/ChainingMethodHandler';
import { ChainingMethodParamsEntity } from '@app/method-handler/ChainingMethodParamsEntity';
import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import { inputHelperIns } from '@app/modules/helper/InputHelper';
import BaseRepositoryService from '@app/services/BaseRepository';
import { IMarkEntitySeenEntity } from '../after-entity-actions/IMarkEntitySeenEntity';
import { fbConversationRepositoryIns } from '../FBConversationRepository';
import { FbConversationsEvents } from '../FbConversationsEvents';
import { afterExpertisePointUpdatedEventEmitterIns } from './AfterExpertisePointUpdatedEventEmitter';
import { ExpertRepository, expertRepositoryIns } from './ExpertRepository';
import { IExpertPointUpdateEntity } from './IExpertPointUpdateEntity';
import {TopicExpertListTransformer, topicExpertListTransformer} from './TopicExpertListTransformer';

export class ExpertRepositoryService extends BaseRepositoryService {
    constructor(expertRepository: ExpertRepository) {
        super(expertRepository);
    }

    public getExpertsByTopic = async (params: any) => {
        const result = await chainingMethodHandlerIns()
        .setNextMethodHandlerNMergeResult(fbConversationRepositoryIns.getEntityNActionID, 'entity_Action_ids', params)
        .setNextMethodHandler(this.mRepository.getExpertsByTopic).setParams(params).get();
        return topicExpertListTransformer.doTransform({user_id: params.user_id, data: result[1]});
    }

    public getListOfExpertiseTopics = async (params) => {
        const result = await chainingMethodHandlerIns().setNextMethodHandlerNPreserveResult(fbConversationRepositoryIns.getEntityNActionID, params).setNextMethodHandlerNPreserveResult(this.mRepository.getListOfExpertiseTopics, params).get();
        return result[1];
    }

    public incrementExpertisePoint = async (params: IExpertPointUpdateEntity) => {
        params.operator = AirthmeticOperatorEnum.PLUS_OPERATOR;
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.updateExpertiseCount).setParams(params).get();

        afterExpertisePointUpdatedEventEmitterIns.emit(FbConversationsEvents.afterExpertisePointUpdated, params);
        return result;
    }

    public decrementExpertisePoint = async (params: IExpertPointUpdateEntity) => {
        params.operator = AirthmeticOperatorEnum.MINUS_OPERATOR;
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.updateExpertiseCount).setParams(params).get();
        afterExpertisePointUpdatedEventEmitterIns.emit(FbConversationsEvents.afterExpertisePointUpdated, params);
        return result;
    }

    public getExpertisePointForExpert = async (params: IExpertPointUpdateEntity) => {
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getExpertisePointForExpert).setParams(params).get();
        return result;
    }

    public incrementExpertiseCountForTopic = async (params: IExpertPointUpdateEntity) => {
        params.operator = AirthmeticOperatorEnum.PLUS_OPERATOR;
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.updateExpertiseCountForTopic).setParams(params).get();
        return result;
    }

    public decrementExpertiseCountForTopic = async (params: IExpertPointUpdateEntity) => {
        params.operator = AirthmeticOperatorEnum.MINUS_OPERATOR;
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.updateExpertiseCountForTopic).setParams(params).get();
        return result;
    }

    public markTopicExpertsSeen = async (params) => {
        // const params = chainingMethodParamsEntity.getTopParams();
        // const entityIdDetails = chainingMethodParamsEntity.getPreservedResultsContainerByIndex(0);
        // const topicExpertList = chainingMethodParamsEntity.getPreservedResultsContainerByIndex(1);
        const unSeenTopicExpertsList = [];
        let params1: IMarkEntitySeenEntity;
        params.expert_topic_seen.forEach((item) => {
            // if (!item.is_topic_expert_seen) {
            params1 = { entity_type_id: 1, user_id: params.user_id, entity_origin_id: item.topic_id, parent_entity_origin_id: item.fb_conversations_topic_expertise_points_id };
            unSeenTopicExpertsList.push(params1);
        });
        if (inputHelperIns.isArrayValidNNotEmpty(unSeenTopicExpertsList)) {
            return await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.markTopicExpertsSeen).setParams(unSeenTopicExpertsList).get();
        }
    }

}
export const expertRepositoryServiceIns = new ExpertRepositoryService(expertRepositoryIns);
