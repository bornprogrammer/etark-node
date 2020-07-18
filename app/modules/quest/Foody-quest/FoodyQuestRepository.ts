import { repositoryMethodHandlerIns } from '@app/method-handler/RepositoryMethodHandler';
import BaseRepository from '@app/repositories/BaseRepository';
import { foodyQuestModelIns } from './FoodyQuestModel';
import { foodyQuestMetricModelIns } from './FoodyQuestMetricModel';
import { ChainingMethodParamsEntity } from '@app/method-handler/ChainingMethodParamsEntity';

export class FoodyQuestRepository extends BaseRepository {

    constructor() {
        super();
    }

    public getFoodyQuestTaskDetails = async () => {
        const foodyQuestTaskDetails = await repositoryMethodHandlerIns.setMethodHandler(foodyQuestModelIns.getFoodyQuestTaskDetails).get();
        return foodyQuestTaskDetails;
    }

    public getFoodyQuestTaskDetailsByQuestId = async (params) => {
        const foodyQuestTaskDetails = await repositoryMethodHandlerIns.setMethodHandler(foodyQuestModelIns.getFoodyQuestTaskDetailsByQuestId).setParams(params).get();
        return foodyQuestTaskDetails;
    }

    public orderOnUniqueDays = async (params) => {
        const orderOnUniqueDays = await repositoryMethodHandlerIns.setMethodHandler(foodyQuestMetricModelIns.orderOnUniqueDays).setParams(params).get();
        return orderOnUniqueDays;
    }

    public getMealsPurchased = async (params) => {
        const mealsPurchased = await repositoryMethodHandlerIns.setMethodHandler(foodyQuestMetricModelIns.getMealsPurchased).setParams(params).get();
        return mealsPurchased;
    }

    public getUniqueCuratedGoodiesPurchased = async (params) => {
        const uniqueCuratedGoodiesPurchased = await repositoryMethodHandlerIns.setMethodHandler(foodyQuestMetricModelIns.getUniqueCuratedGoodiesPurchased).setParams(params).get();
        return uniqueCuratedGoodiesPurchased;
    }

    public orderFromUniqueChefs = async (params) => {
        const orderFromUniqueChefs = await repositoryMethodHandlerIns.setMethodHandler(foodyQuestMetricModelIns.orderFromUniqueChefs).setParams(params).get();
        return orderFromUniqueChefs;
    }

    public updateTrackUserQuest = async (params) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(foodyQuestModelIns.updateTrackUserQuest).setParams(params).get();
        return result;
    }

    public insertTrackUserQuest = async (params) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(foodyQuestModelIns.insertTrackUserQuest).setParams(params).get();
        return result;
    }

    public isAllFoodyTaskCompleted = async (params) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(foodyQuestModelIns.isAllFoodyTaskCompleted).setParams(params).get();
        return result;
    }

    public markFoodyQuestComplete = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const params = chainingMethodParamsEntity.getTopParams();
        const result = await repositoryMethodHandlerIns.setMethodHandler(foodyQuestModelIns.markFoodyQuestComplete).setParams(params).get();
        return result;
    }

    public updateWallet = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const params: any = chainingMethodParamsEntity.getTopParams();
        const rewardDetails = chainingMethodParamsEntity.getPreservedResultsContainerByIndex(0)[0];
        params.foody_quest_reward_id = rewardDetails.foody_quest_reward_id;
        params.reward_monetary_val = rewardDetails.reward_monetary_val;
        const result = await repositoryMethodHandlerIns.setMethodHandler(foodyQuestModelIns.updateWallet).setParams(params).get();
        return result;
    }

    public isQuestCompletedForFoody = async (params) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(foodyQuestModelIns.isQuestCompletedForFoody).setParams(params).get();
        return result;
    }

    public addUserQuestReward = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const params: any = chainingMethodParamsEntity.getTopParams();
        const rewardDetails = chainingMethodParamsEntity.getPreservedResultsContainerByIndex(0)[0];
        params.foody_quest_reward_id = rewardDetails.foody_quest_reward_id;
        const result = await repositoryMethodHandlerIns.setMethodHandler(foodyQuestModelIns.addUserQuestReward).setParams(params).get();
        return result;
    }

    public getFoodyRewardDetails = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const params = chainingMethodParamsEntity.getTopParams();
        const result = await repositoryMethodHandlerIns.setMethodHandler(foodyQuestModelIns.getFoodyRewardDetails).setParams(params).get();
        return result;
    }

    public getAllUsersWhoseTaskGotCompleted = async () => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(foodyQuestModelIns.getAllUsersWhoseTaskGotCompleted).get();
        return result;
    }

    public getAllUsersWhoseTaskGotCompletedByQuestId = async (params) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(foodyQuestModelIns.getAllUsersWhoseTaskGotCompletedByQuestId).setParams(params).get();
        return result;
    }
}

export const foodyQuestRepositoryIns = new FoodyQuestRepository();
