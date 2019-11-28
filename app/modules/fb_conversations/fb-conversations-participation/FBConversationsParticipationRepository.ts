import BaseRepository from '@app/repositories/BaseRepository';
import { FBConversationsParticipationMetricTypeEnum } from './FBConversationsParticipationMetricTypeEnum';
import { repositoryMethodHandlerIns } from '@app/method-handler/RepositoryMethodHandler';
import { fbConversationsParticipationModelIns } from './FBConversationsParticipationModel';
import { IFBConversationsParticipationQuestDetailsByMetricTypeEntity } from './IFBConversationsParticipationQuestDetailsByMetricTypeEntity';
import { IFbConversationsParticipatioQuestTaskUpdatedEntity } from './IFbConversationsParticipatioQuestTaskUpdatedEntity';
import { IParticipationQuestCompletedStatusEntity } from './IParticipationQuestCompletedStatusEntity';

export class FBConversationsParticipationRepository extends BaseRepository {

    constructor() {
        super();
    }

    public getFBConversationsParticipationQuestDetails = async (params: IFBConversationsParticipationQuestDetailsByMetricTypeEntity) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(fbConversationsParticipationModelIns.getFBConversationsParticipationQuestDetails).setParams(params).get();
        return result;
    }

    public updateFbConversationsParticipatioQuestTaskTrack = async (params: IFbConversationsParticipatioQuestTaskUpdatedEntity) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(fbConversationsParticipationModelIns.updateFbConversationsParticipatioQuestTaskTrack).setParams(params).get();
        return result;
    }

    public updateParticipationQuestCompletedStatus = async (params: IParticipationQuestCompletedStatusEntity) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(fbConversationsParticipationModelIns.updateParticipationQuestCompletedStatus).setParams(params).get();
        return result;
    }

}

export const fbConversationsParticipationRepositoryIns = new FBConversationsParticipationRepository();
