import { sequelize } from '@app/config/Sequelize';
import { Sequelize } from 'sequelize';
import { FBConversationsParticipationMetricTypeEnum } from './FBConversationsParticipationMetricTypeEnum';
import { IFBConversationsParticipationQuestDetailsByMetricTypeEntity } from './IFBConversationsParticipationQuestDetailsByMetricTypeEntity';
import { IFbConversationsParticipatioQuestTaskUpdatedEntity } from './IFbConversationsParticipatioQuestTaskUpdatedEntity';
import { IParticipationQuestCompletedStatusEntity } from './IParticipationQuestCompletedStatusEntity';

class FBConversationsParticipationModel {
    private sequelizeCon: Sequelize;

    constructor() {
        this.sequelizeCon = sequelize;
    }

    public updateFbConversationsParticipatioQuestTaskTrack = async (params: IFbConversationsParticipatioQuestTaskUpdatedEntity) => {
        try {
            const completedAt = params.is_completed === 1 ? `CURRENT_TIMESTAMP` : null;
            const sql = `insert into fb_conversations_participants_quest_task_track(fb_conversations_participants_quest_task_id,current_metric_count,user_id,is_completed,completed_at,created_at,updated_at)
            VALUES(${params.quest_task_id},1,${params.user_id},${params.is_completed},${completedAt},CURRENT_TIMESTAMP,CURRENT_TIMESTAMP) on duplicate key update current_metric_count=current_metric_count${params.operator}1,is_completed=${params.is_completed},completed_at=${completedAt}`;
            const result = await this.sequelizeCon.query(sql);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    public getFBConversationsParticipationQuestDetails = async (params: IFBConversationsParticipationQuestDetailsByMetricTypeEntity) => {
        try {
            // tslint:disable-next-line: max-line-length
            const sql = `SELECT fb_conversations_participants_quest_task.id as quest_task_id,task.goal,fb_conversations_participants_quest_task.fb_conversations_participants_quest_id as quest_id,ifnull(fb_conversations_participants_quest_task_track.is_completed,0) as is_completed,ifnull(fb_conversations_participants_quest_task_track.current_metric_count,0) as current_metric_count, metric.metric_type,fb_conversations_participants_quest_completed.is_completed as is_quest_completed from fb_conversations_participants_quest inner join fb_conversations_participants_quest_task on fb_conversations_participants_quest.id = fb_conversations_participants_quest_task.fb_conversations_participants_quest_id inner join task on task.id = fb_conversations_participants_quest_task.task_id inner join metric on metric.id = task.metric_id inner join fb_conversations_participants_quest_completed on fb_conversations_participants_quest_completed.user_id=${params.user_id} and fb_conversations_participants_quest_completed.fb_conversations_participants_quest_id=fb_conversations_participants_quest.id left join fb_conversations_participants_quest_task_track on fb_conversations_participants_quest_task_track.fb_conversations_participants_quest_task_id = fb_conversations_participants_quest_task.id and fb_conversations_participants_quest_task_track.user_id=${params.user_id} where fb_conversations_participants_quest.is_active = 1 and fb_conversations_participants_quest.start_date <= '${params.curdate}' and fb_conversations_participants_quest.end_date >= '${params.curdate}' and metric.is_active = 1`;
            const result = await this.sequelizeCon.query(sql);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    public updateParticipationQuestCompletedStatus = async (params: IParticipationQuestCompletedStatusEntity) => {
        try {
            const completedAt = params.is_completed === 1 ? `CURRENT_TIMESTAMP` : null;
            const query = `update fb_conversations_participants_quest_completed set is_completed = ${params.is_completed}, completed_at = ${completedAt} where fb_conversations_participants_quest_id = ${params.quest_id} and user_id = ${params.user_id} `;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }
}

export const fbConversationsParticipationModelIns = new FBConversationsParticipationModel();