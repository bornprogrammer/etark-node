import { ChainingMethodParamsEntity } from '@app/method-handler/ChainingMethodParamsEntity';
import { repositoryMethodHandlerIns } from '@app/method-handler/RepositoryMethodHandler';
import BaseRepository from '@app/repositories/BaseRepository';
import { expertModelIns } from './ExpertModel';
import { IExpertPointUpdateEntity } from './IExpertPointUpdateEntity';

export class ExpertRepository extends BaseRepository {
    constructor() {
        super();
    }

    public getExpertsByTopic = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const params = chainingMethodParamsEntity.getTopParams();
        // Object.assign(params, chainingMethodParamsEntity.getPreservedResultsContainerByIndex(0));
        const result = await repositoryMethodHandlerIns
        .setMethodHandler(expertModelIns.getExpertsByTopic)
        .setParams(params).get();
        return result;
    }
    public getListOfExpertiseTopics = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const params = chainingMethodParamsEntity.getTopParams();
        Object.assign(params, chainingMethodParamsEntity.getPreservedResultsContainerByIndex(0));
        const result = await repositoryMethodHandlerIns.setMethodHandler(expertModelIns.getListOfExpertiseTopics).setParams(params).get();
        return result;
    }

    public updateExpertiseCount = async (params: IExpertPointUpdateEntity) => {
        params.expertise_point = params.expertise_point >= 0 ? params.expertise_point : 1;
        const result = await repositoryMethodHandlerIns.setMethodHandler(expertModelIns.updateExpertiseCount).setParams(params).get();
        return result;
    }

    public updateExpertiseCountForTopic = async (params: IExpertPointUpdateEntity) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(expertModelIns.updateExpertiseCountForTopic).setParams(params).get();
        return result;
    }

    public getExpertisePointForExpert = async (params: IExpertPointUpdateEntity) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(expertModelIns.getExpertisePointForExpert).setParams(params).get();
        return result;
    }

    public markTopicExpertsSeen = async (params: any) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(expertModelIns.markTopicExpertsSeen).setParams(params).get();
        return result;
    }
}

export const expertRepositoryIns = new ExpertRepository();
