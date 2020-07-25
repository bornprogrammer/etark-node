import { AirthmeticOperatorEnum } from '@app/enums/AirthmeticOperatorEnum';
import { BaseEventEmitter } from '@app/events-emitter/BaseEventEmitter';
import { DateHelper } from '@app/modules/helper/DateHelper';
import { inputHelperIns } from '@app/modules/helper/InputHelper';
import { FbConversationsEvents } from '../FbConversationsEvents';
import { fbConversationsParticipationRepositoryServiceIns } from './FBConversationsParticipationRepositoryService';
import { IFBConversationsParticipationQuestDetailsByMetricTypeEntity } from './IFBConversationsParticipationQuestDetailsByMetricTypeEntity';
import { IFbConversationsParticipatioQuestTaskUpdatedEntity } from './IFbConversationsParticipatioQuestTaskUpdatedEntity';
import { IParticipationQuestCompletedStatusEntity } from './IParticipationQuestCompletedStatusEntity';

export class FbConversationsParticipationTaskUpdatedEventEmitter extends BaseEventEmitter {

    constructor() {
        super(FbConversationsEvents.afterFbConversationParticipationTaskUpdated);
    }

    public async handle(data?: IFbConversationsParticipatioQuestTaskUpdatedEntity) {

        const params: IFBConversationsParticipationQuestDetailsByMetricTypeEntity = { user_id: data.user_id, curdate: DateHelper.getCurrentUTCDateAsMysqlStr() };
        const fbConversationsParticipationQuestDetails = await fbConversationsParticipationRepositoryServiceIns.getFBConversationsParticipationQuestDetails(params);

        if (inputHelperIns.isArrayValidNNotEmpty(fbConversationsParticipationQuestDetails)) {

            switch (data.operator) {
                case AirthmeticOperatorEnum.PLUS_OPERATOR:
                    this.increaseFbConversationsParticipatioQuestTaskTrackPoint(data, fbConversationsParticipationQuestDetails);
                    break;
                case AirthmeticOperatorEnum.MINUS_OPERATOR:
                    this.decreaseFbConversationsParticipatioQuestTaskTrackPoint(data, fbConversationsParticipationQuestDetails);
                    break;
            }
        }
    }

    private increaseFbConversationsParticipatioQuestTaskTrackPoint = async (params: IFbConversationsParticipatioQuestTaskUpdatedEntity, fbConversationsParticipationQuestDetails: any) => {
        let completedTaskCnt = 0;
        if (fbConversationsParticipationQuestDetails[0].is_quest_completed !== 1) {
            fbConversationsParticipationQuestDetails.forEach((item) => {

                if (item.is_completed !== 1 && params.quest_task_type === item.metric_type) {
                    const isTaskCompleted = (item.goal - item.current_metric_count) === 1 ? 1 : 0;
                    completedTaskCnt += isTaskCompleted;
                    const updateTaskParams: IFbConversationsParticipatioQuestTaskUpdatedEntity = { is_completed: isTaskCompleted, operator: AirthmeticOperatorEnum.PLUS_OPERATOR, quest_task_id: item.quest_task_id, user_id: params.user_id };
                    fbConversationsParticipationRepositoryServiceIns.increaseFbConversationsParticipatioQuestTaskTrackPoint(updateTaskParams);
                }
                completedTaskCnt += item.is_completed;
            });
        }
        if (fbConversationsParticipationQuestDetails[0].is_quest_completed !== 1 && completedTaskCnt === fbConversationsParticipationQuestDetails.length && completedTaskCnt !== 0) {
            const params1: IParticipationQuestCompletedStatusEntity = { user_id: params.user_id, quest_id: fbConversationsParticipationQuestDetails[0].quest_id };
            fbConversationsParticipationRepositoryServiceIns.markParticipationQuestCompleted(params1);
        }
    }

    private decreaseFbConversationsParticipatioQuestTaskTrackPoint = async (params: IFbConversationsParticipatioQuestTaskUpdatedEntity, fbConversationsParticipationQuestDetails: any) => {

        fbConversationsParticipationQuestDetails.forEach((item) => {

            if (params.quest_task_type === item.metric_type) {
                const updateTaskParams: IFbConversationsParticipatioQuestTaskUpdatedEntity = { is_completed: 0, operator: AirthmeticOperatorEnum.MINUS_OPERATOR, quest_task_id: item.quest_task_id, user_id: params.user_id };
                fbConversationsParticipationRepositoryServiceIns.decreseFbConversationsParticipatioQuestTaskTrackPoint(updateTaskParams);
            }
        });

        if (fbConversationsParticipationQuestDetails[0].is_quest_completed === 1) {
            const params1: IParticipationQuestCompletedStatusEntity = { user_id: params.user_id, quest_id: fbConversationsParticipationQuestDetails[0].quest_id };
            fbConversationsParticipationRepositoryServiceIns.unMarkParticipationQuestCompleted(params1);
        }
    }
}

export const fbConversationsParticipationTaskUpdatedEventEmitterIns = new FbConversationsParticipationTaskUpdatedEventEmitter();
