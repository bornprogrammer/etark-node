import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import BaseRepositoryService from '@app/services/BaseRepository';
import { FBConversationsParticipationRepository, fbConversationsParticipationRepositoryIns } from './FBConversationsParticipationRepository';
import { IFBConversationsParticipationQuestDetailsByMetricTypeEntity } from './IFBConversationsParticipationQuestDetailsByMetricTypeEntity';
import { IFbConversationsParticipatioQuestTaskUpdatedEntity } from './IFbConversationsParticipatioQuestTaskUpdatedEntity';
import { AirthmeticOperatorEnum } from '@app/enums/AirthmeticOperatorEnum';
import { IParticipationQuestCompletedStatusEntity } from './IParticipationQuestCompletedStatusEntity';

class FBConversationsParticipationRepositoryService extends BaseRepositoryService {

    constructor(fbConversationsParticipationRepository: FBConversationsParticipationRepository) {
        super(fbConversationsParticipationRepository);
    }

    public getFBConversationsParticipationQuestDetails = async (params: IFBConversationsParticipationQuestDetailsByMetricTypeEntity) => {

        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getFBConversationsParticipationQuestDetails).setParams(params).get();
        return result;
    }

    public increaseFbConversationsParticipatioQuestTaskTrackPoint = async (params: IFbConversationsParticipatioQuestTaskUpdatedEntity) => {
        params.operator = AirthmeticOperatorEnum.PLUS_OPERATOR;
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.updateFbConversationsParticipatioQuestTaskTrack).setParams(params).get();
    }

    public decreseFbConversationsParticipatioQuestTaskTrackPoint = async (params: IFbConversationsParticipatioQuestTaskUpdatedEntity) => {
        params.operator = AirthmeticOperatorEnum.MINUS_OPERATOR;
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.updateFbConversationsParticipatioQuestTaskTrack).setParams(params).get();
    }

    public markParticipationQuestCompleted = async (params: IParticipationQuestCompletedStatusEntity) => {
        params.is_completed = 1;
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.updateParticipationQuestCompletedStatus).setParams(params).get();
    }

    public unMarkParticipationQuestCompleted = async (params: IParticipationQuestCompletedStatusEntity) => {
        params.is_completed = 0;
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.updateParticipationQuestCompletedStatus).setParams(params).get();
    }
}

export const fbConversationsParticipationRepositoryServiceIns = new FBConversationsParticipationRepositoryService(fbConversationsParticipationRepositoryIns);
