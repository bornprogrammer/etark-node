import { chainingMethodHandlerIns } from '@app/method-handler/ChainingMethodHandler';
import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import { DateHelper } from '@app/modules/helper/DateHelper';
import { inputHelperIns } from '@app/modules/helper/InputHelper';
import BaseRepositoryService from '@app/services/BaseRepositoryService';
import { FoodyQuestMetricTypeEnum } from './FoodyQuestMetricTypeEnum';
import { FoodyQuestRepository, foodyQuestRepositoryIns } from './FoodyQuestRepository';

export class FoodyQuestRepositoryService extends BaseRepositoryService {

    constructor(foodyQuestRepository: FoodyQuestRepository) {
        super(foodyQuestRepository);
    }

    public cron = async () => {
        const foodyQuestTaskDetails = await this.getFoodyQuestTaskDetails();
        if (inputHelperIns.isInputValid(foodyQuestTaskDetails)) {
            for (const items of foodyQuestTaskDetails) {
                // if (items.user_id === 36432 && items.foody_quest_id === 10) {
                const metricCnt = await this.getMetricDetailsByUserIdNMetricType(items.user_id, items.metric_type, items.start_date);
                if ((metricCnt > 0 && metricCnt !== items.current_metric_count && metricCnt < items.goal) || (metricCnt >= items.goal && items.is_completed === 0)) {
                    // tslint:disable-next-line: radix
                    if (metricCnt >= items.goal) {
                        items.is_completed = 1;
                        items.current_metric_count = items.goal;
                    } else {
                        items.is_completed = 0;
                        items.current_metric_count = metricCnt;
                    }

                    if (items.foody_track_user_quest_id === null) {
                        this.insertTrackUserQuest(items);
                    } else {
                        this.updateTrackUserQuest(items);
                    }
                    // }
                }
            }
            this.onFoodyQuestTaskCompleted();
        }
    }

    public updatePreviousCronTask = async (params) => {

        const foodyQuestTaskDetails = await this.getFoodyQuestTaskDetailsByQuestId(params);
        if (inputHelperIns.isInputValid(foodyQuestTaskDetails)) {
            for (const items of foodyQuestTaskDetails) {
                // if (items.user_id === 36432 && items.foody_quest_id === 10) {
                const metricCnt = await this.getMetricDetailsByUserIdNMetricType(items.user_id, items.metric_type, items.start_date);
                if ((metricCnt > 0 && metricCnt !== items.current_metric_count && metricCnt < items.goal) || (metricCnt >= items.goal && items.is_completed === 0)) {
                    // tslint:disable-next-line: radix
                    if (metricCnt >= items.goal) {
                        items.is_completed = 1;
                        items.current_metric_count = items.goal;
                    } else {
                        items.is_completed = 0;
                        items.current_metric_count = metricCnt;
                    }

                    if (items.foody_track_user_quest_id === null) {
                        this.insertTrackUserQuest(items);
                    } else {
                        this.updateTrackUserQuest(items);
                    }
                    // }
                }
            }
            this.onFoodyQuestTaskCompletedForThePreviousQuest(params);
        }
    }

    // markFoodyQuestComplete
    public onFoodyQuestTaskCompleted = async () => {
        const allUsersWhoseTaskGotCompleted = await this.getAllUsersWhoseTaskGotCompleted();
        if (inputHelperIns.isInputValid(allUsersWhoseTaskGotCompleted)) {
            for (const items of allUsersWhoseTaskGotCompleted) {
                this.afterFoodyQuestTaskCompleted(items);
            }
        }
    }

    // for the previous quest
    public onFoodyQuestTaskCompletedForThePreviousQuest = async (params) => {
        const allUsersWhoseTaskGotCompleted = await this.getAllUsersWhoseTaskGotCompletedByQuestId(params);
        if (inputHelperIns.isInputValid(allUsersWhoseTaskGotCompleted)) {
            for (const items of allUsersWhoseTaskGotCompleted) {
                this.afterFoodyQuestTaskCompleted(items);
            }
        }
    }

    public getAllUsersWhoseTaskGotCompleted = async () => {
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getAllUsersWhoseTaskGotCompleted).get();
        return result;
    }

    public getAllUsersWhoseTaskGotCompletedByQuestId = async (params) => {
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getAllUsersWhoseTaskGotCompletedByQuestId).setParams(params).get();
        return result;
    }

    public afterFoodyQuestTaskCompleted = async (params) => {
        const result = await chainingMethodHandlerIns().setNextMethodHandler(this.mRepository.markFoodyQuestComplete, params).setNextMethodHandlerNPreserveResult(this.mRepository.getFoodyRewardDetails).setNextMethodHandler(this.mRepository.addUserQuestReward).setNextMethodHandler(this.mRepository.updateWallet).get();
        return result;
    }

    public isQuestCompletedForFoody = async (params) => {
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.isQuestCompletedForFoody).setParams(params).get();
        return result;
    }

    public isAllFoodyTaskCompleted = async (params) => {
        const isAllFoodyTaskCompleted = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.isAllFoodyTaskCompleted).setParams(params).get();
        return isAllFoodyTaskCompleted;
    }

    public getFoodyQuestTaskDetails = async () => {
        const foodyQuestTaskDetails = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getFoodyQuestTaskDetails).get();
        return foodyQuestTaskDetails;
    }

    public getFoodyQuestTaskDetailsByQuestId = async (params) => {
        const foodyQuestTaskDetails = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getFoodyQuestTaskDetailsByQuestId).setParams(params).get();
        return foodyQuestTaskDetails;
    }

    public updateTrackUserQuest = async (params) => {
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.updateTrackUserQuest).setParams(params).get();
        return result;
    }

    public insertTrackUserQuest = async (params) => {
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.insertTrackUserQuest).setParams(params).get();
        return result;
    }

    public getMetricDetailsByUserIdNMetricType = async (userId, metricType: FoodyQuestMetricTypeEnum, foodyQuestStartDay) => {
        let metricDetails = null;
        const params = { from_date: foodyQuestStartDay, to_date: DateHelper.getCurrentDateAsMysqlStr(), foody_id: userId };
        switch (metricType) {

            case FoodyQuestMetricTypeEnum.GOODIES:
                metricDetails = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getUniqueCuratedGoodiesPurchased).setParams(params).get();
                return metricDetails;
                break;
            case FoodyQuestMetricTypeEnum.UNIQUE_CHEFS:
                metricDetails = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.orderFromUniqueChefs).setParams(params).get();
                return metricDetails;
                break;
            case FoodyQuestMetricTypeEnum.UNIQUE_DAYS:
                metricDetails = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.orderOnUniqueDays).setParams(params).get();
                return metricDetails;
                break;
            case FoodyQuestMetricTypeEnum.MEALS_PURCHASED:
                metricDetails = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getMealsPurchased).setParams(params).get();
                return metricDetails;
                break;
        }
    }
}

export const foodyQuestRepositoryServiceIns = new FoodyQuestRepositoryService(foodyQuestRepositoryIns);
