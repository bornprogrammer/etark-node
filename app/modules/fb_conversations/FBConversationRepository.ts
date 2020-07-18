import { ChainingMethodParamsEntity } from '@app/method-handler/ChainingMethodParamsEntity';
import { repositoryMethodHandlerIns } from '@app/method-handler/RepositoryMethodHandler';
import BaseRepository from '@app/repositories/BaseRepository';
import { IMarkEntitySeenEntity } from './after-entity-actions/IMarkEntitySeenEntity';
import { fbConversationModelIns } from './FBConversationModel';
import { ITopicMetadataUpdateCountEntity } from './topics/ITopicMetadataUpdateCountEntity';
import { FBConversationsEntityEnum } from './FBConversationsEntityEnum';
import { IEntity } from './IEntity';

export class FBConversationRepository extends BaseRepository {
    constructor() {
        super();
    }

    public getEntityNActionID = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        let result = null;
        const params = chainingMethodParamsEntity.getTopParams();
        // const result1 = await repositoryMethodHandlerIns.setMethodHandler(fbConversationModelIns.getEntityIDByEntityType).setParams(params.entity_type).get();
        const result1 = await this.getEntityTypeId(chainingMethodParamsEntity);
        if (result1) {
            const result2 = await repositoryMethodHandlerIns.setMethodHandler(fbConversationModelIns.getEntityActionIDByEntityActionType).setParams(params.entity_action_type).get();
            if (result2) {
                result = Object.assign(result1, result2);
            }
        }
        return result;
    }

    public getEntityTypeId = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const params = chainingMethodParamsEntity.getTopParams();
        const result = await repositoryMethodHandlerIns.setMethodHandler(fbConversationModelIns.getEntityIDByEntityType).setParams(params.entity_type).get();
        return result;
    }

    public getEntityActionCountById = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const params = { entity_origin_id: chainingMethodParamsEntity.getTopParams().entity_origin_id };
        Object.assign(params, chainingMethodParamsEntity.getResult());
        const result = await repositoryMethodHandlerIns.setMethodHandler(fbConversationModelIns.getEntityActionCountById).setParams(params).get();
        return result;
    }

    public entityActionAdd = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(fbConversationModelIns.entityActionAdd).setParams(this.getEntityNActionTypeParams(chainingMethodParamsEntity)).get();
        return result;
    }

    public entityActionDelete = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(fbConversationModelIns.entityActionDelete).setParams(this.getEntityNActionTypeParams(chainingMethodParamsEntity)).get();
        return result;
    }

    public incrementEntityActionCount = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const params = this.getEntityNActionTypeParams(chainingMethodParamsEntity);
        params.operator = '+';
        const result = await repositoryMethodHandlerIns.setMethodHandler(fbConversationModelIns.updateEntityActionCount).setParams(params).get();
        return result;
    }

    public decrementEntityActionCount = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const params = this.getEntityNActionTypeParams(chainingMethodParamsEntity);
        params.operator = '-';
        const result = await repositoryMethodHandlerIns.setMethodHandler(fbConversationModelIns.updateEntityActionCount).setParams(params).get();
        return result;
    }

    public updateTopicMetadataCount = async (params: ITopicMetadataUpdateCountEntity) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(fbConversationModelIns.updateTopicMetadataCount).setParams(params).get();
        return result;
    }

    public markEntitySeen = async (params: IMarkEntitySeenEntity) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(fbConversationModelIns.markEntitySeen).setParams(params).get();
        return result;
    }

    public getQuestDiscussionTaskDetails = async (params) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(fbConversationModelIns.getQuestDiscussionTaskDetails).setParams(params).get();
        return result;
    }

    public getDiscussionNFrequentlyAskedQuestionsNAnswers = async () => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(fbConversationModelIns.getDiscussionNFrequentlyAskedQuestionsNAnswers).get();
        return result;
    }

    public getBuddyQuestDiscussionDetails = async (params: ChainingMethodParamsEntity) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(fbConversationModelIns.getBuddyQuestDiscussionDetails).setParams(params.getTopParams()).get();
        return result;
    }

    // public getUserIdWhoBookmarkedTopicByQuestionId = async (questionId) => {
    //     const result = await repositoryMethodHandlerIns.setMethodHandler(fbConversationModelIns.getUserIdWhoBookmarkedTopicByQuestionId).setParams(questionId).get();
    //     return result;
    // }

    public getTopicCountNExpertTopicRecentDiscussionCountsForBuddyDashboard = async (params: ChainingMethodParamsEntity) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(fbConversationModelIns.getTopicCountNExpertTopicRecentDiscussionCountsForBuddyDashboard).setParams(params.getTopParams()).get();
        return result;
    }

    private getEntityNActionTypeParams = (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const entityNActionType = chainingMethodParamsEntity.getPreservedResultsContainerByIndex(0);
        const topParams = chainingMethodParamsEntity.getTopParams();
        return Object.assign(entityNActionType, topParams);
    }

}

export const fbConversationRepositoryIns = new FBConversationRepository();
