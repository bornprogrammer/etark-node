import { sequelize } from '@app/config/Sequelize';
import { Sequelize } from 'sequelize';
import { FBConversationsEntityActionEnum } from './FBConversationsEntityActionEnum';
import { FBConversationsEntityEnum } from './FBConversationsEntityEnum';
import { ITopicMetadataUpdateCountEntity } from './topics/ITopicMetadataUpdateCountEntity';
import { IMarkEntitySeenEntity } from './after-entity-actions/IMarkEntitySeenEntity';
import { AppConst } from '@app/app-const/AppConst';
import { FbConversationsConfiguration } from './FbConversationsConfiguration';
import { IEntity } from './IEntity';

class FBConversationModel {
    private sequelizeCon: Sequelize;
    constructor() {
        this.sequelizeCon = sequelize;
    }

    public getEntityIDByEntityType = async (entityType: FBConversationsEntityEnum) => {
        try {
            const sql = `SELECT id as entity_type_id from fb_conversations_entity_type_lookup where fb_conversation_enity_type='${entityType}' and is_enabled=1 and is_deleted=0`;
            const result = await this.sequelizeCon.query(sql);
            return result[0].length > 0 ? result[0][0] : null;
        } catch (error) {
            throw error;
        }
    }

    public getEntityActionIDByEntityActionType = async (entityActionType: FBConversationsEntityActionEnum) => {
        try {
            const sql = `SELECT id as entity_action_type_id from fb_conversations_action_type_lookup where fb_conversations_action_type='${entityActionType}' and is_enabled=1 and is_deleted=0`;
            const result = await this.sequelizeCon.query(sql);
            return result[0].length > 0 ? result[0][0] : null;
        } catch (error) {
            throw error;
        }
    }

    public entityActionAdd = async (params) => {
        try {
            const sql = `INSERT into fb_conversations_entity_actions_details(user_id,fb_conversation_actions_type_lookup_id,fb_conversation_entity_type_lookup_id,entity_origin_id,created_at,updated_at) VALUES(${params.user_id},${params.entity_action_type_id},${params.entity_type_id},${params.entity_origin_id},CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`;
            const result = await this.sequelizeCon.query(sql);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public entityActionDelete = async (params) => {
        try {
            const sql = `UPDATE fb_conversations_entity_actions_details set is_deleted=1,updated_at=CURRENT_TIMESTAMP where user_id=${params.user_id} and fb_conversation_actions_type_lookup_id=${params.entity_action_type_id} and fb_conversation_entity_type_lookup_id=${params.entity_type_id} and entity_origin_id=${params.entity_origin_id}`;
            const result = await this.sequelizeCon.query(sql);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public updateEntityActionCount = async (params) => {
        try {
            // tslint:disable-next-line: max-line-length
            const sql = `INSERT into fb_conversations_entity_actions_count(fb_conversations_entity_type_lookup_id,fb_conversations_action_type_lookup_id,fb_conversations_entity_origin_id,fb_conversations_action_count,created_at,updated_at) VALUES(${params.entity_type_id},${params.entity_action_type_id},${params.entity_origin_id},1,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP) on duplicate key UPDATE fb_conversations_action_count=fb_conversations_action_count${params.operator}1,updated_at=CURRENT_TIMESTAMP`;
            const result = await this.sequelizeCon.query(sql);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public updateTopicMetadataCount = async (params: ITopicMetadataUpdateCountEntity) => {
        try {
            const getTopicMetadataTypeSql = `SELECT id from fb_conversations_topic_metadata_type where fb_conversations_topic_metadata_name='${params.topicMetaDataType}' and is_enabled=1 and is_deleted=0`;
            const getTopicMetadataTypeResult = await this.sequelizeCon.query(getTopicMetadataTypeSql);
            const sql = `INSERT into fb_conversations_topic_metadata_count(fb_conversations_topic_id,fb_conversations_topic_metadata_type_id,count,created_at,updated_at)
            value(${params.topicId},${getTopicMetadataTypeResult[0][0].id},1,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP) on duplicate key update count=count${params.operator}${params.count},updated_at=CURRENT_TIMESTAMP`;
            const result = await this.sequelizeCon.query(sql);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public getQuestDiscussionTaskDetails = async (params) => {
        try {
            // tslint:disable-next-line: max-line-length
            const sql = `SELECT fb_conversations_participants_quest.learn_more_description,fb_conversations_participants_quest.reward_amount,fb_conversations_participants_quest.name,fb_conversations_participants_quest.end_date,fb_conversations_participants_quest.description,task.task_name,task.description as task_description,task.goal,ifnull(fb_conversations_participants_quest_task_track.is_completed,0) as is_completed,ifnull(fb_conversations_participants_quest_task_track.current_metric_count,0) as current_metric_count from fb_conversations_participants_quest inner join fb_conversations_participants_quest_task on fb_conversations_participants_quest.id = fb_conversations_participants_quest_task.fb_conversations_participants_quest_id inner join task on fb_conversations_participants_quest_task.task_id = task.id left join fb_conversations_participants_quest_task_track on fb_conversations_participants_quest_task_track.fb_conversations_participants_quest_task_id = fb_conversations_participants_quest_task.id and fb_conversations_participants_quest_task_track.user_id=${params.user_id} where fb_conversations_participants_quest.is_active = 1
        and '${params.curdate}' BETWEEN fb_conversations_participants_quest.start_date and fb_conversations_participants_quest.end_date`;
            const result = await this.sequelizeCon.query(sql);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    public getDiscussionNFrequentlyAskedQuestionsNAnswers = async (params) => {
        try {
            // tslint:disable-next-line: max-line-length
            const sql = `SELECT question,answer from frequently_asked_questions where type='fb_conversations'`;
            const result = await this.sequelizeCon.query(sql);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    public getBuddyQuestDiscussionDetails = async (params) => {
        try {
            // tslint:disable-next-line: max-line-length
            const sql = `select question_details.*,a1.answered_by from (SELECT question_abs.user_id as question_abused_reported_user_id,question_irr.user_id as question_irrelevant_marked_user_id,count(fb_conversations_topic_questions_answers.id) as answer_count,fb_conversations_topics.topic as topic_name,fb_conversations_topics.id as topic_id,fb_conversations_topic_questions.question,fb_conversations_topic_questions.id as question_id,fb_conversations_topic_questions.created_at,users.name,users.profile from fb_conversations_topic_questions inner join fb_conversations_topics on fb_conversations_topics.id = fb_conversations_topic_questions.fb_conversations_topic_id inner join users on users.id = fb_conversations_topic_questions.created_by left join fb_conversations_topic_questions_answers on fb_conversations_topic_questions.id = fb_conversations_topic_questions_answers.fb_conversations_topic_question_id and fb_conversations_topic_questions_answers.is_enabled = 1 and fb_conversations_topic_questions_answers.is_deleted = 0 left join fb_conversations_entity_actions_details as question_abs
            on question_abs.fb_conversation_actions_type_lookup_id = 3 and
               question_abs.fb_conversation_entity_type_lookup_id = 2 and
               fb_conversations_topic_questions.id = question_abs.entity_origin_id and
               question_abs.is_deleted = 0 and question_abs.user_id = ${params.user_id}
left join fb_conversations_entity_actions_details as question_irr
            on question_irr.fb_conversation_actions_type_lookup_id = 7 and
               question_irr.fb_conversation_entity_type_lookup_id = 2 and
               fb_conversations_topic_questions.id = question_irr.entity_origin_id and
               question_irr.is_deleted = 0 and question_irr.user_id = ${params.user_id} where fb_conversations_topic_questions.created_by!=${params.user_id} and  fb_conversations_topic_questions.is_deleted = 0 and (fb_conversations_topic_questions.is_enabled = 1
                or question_abs.id is not null or question_irr.id is not null) and fb_conversations_topics.is_enabled = 1 and users.user_status = 'active' and fb_conversations_topics.is_deleted = 0 and datediff('${params.curdate}',date(fb_conversations_topic_questions.created_at))<= 7 GROUP by fb_conversations_topic_questions.id desc) as question_details left join fb_conversations_topic_questions_answers as a1 on
                question_details.question_id = a1.fb_conversations_topic_question_id and a1.is_enabled = 1 and a1.is_deleted = 0 and a1.answered_by=${params.user_id} where (a1.answered_by is null or a1.answered_by!=${params.user_id}) limit ${params.offset},${FbConversationsConfiguration.buddyRecentQuestionLimit}`;
            const result = await this.sequelizeCon.query(sql);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    public getTopicCountNExpertTopicRecentDiscussionCountsForBuddyDashboard = async (params) => {
        try {
            // tslint:disable-next-line: max-line-length
            const sql = `SELECT count(id) as counts from fb_conversations_topics where is_enabled = 1 and is_deleted = 0 union all select count(t.question_id) from (select count(fb_conversations_topic_questions_answers.id) as answer_count,topic_expert_details.topic_cnt,topic_expert_details.topic_ids,fb_conversations_topics.topic as topic_name,fb_conversations_topics.id as topic_id,fb_conversations_topic_questions.question,fb_conversations_topic_questions.id as question_id,users.name as questioned_by,users.id as questioned_by_id,users.profile,fb_conversations_topic_questions.created_at,fbead5.user_id as question_abused_reported_user_id,fbead6.user_id as question_irrelevant_marked_user_id from fb_conversations_topics inner join (SELECT COUNT(fb_conversations_topic_expertise_points.fb_conversations_topic_id) as topic_cnt,json_arrayagg(fb_conversations_topic_expertise_points.fb_conversations_topic_id) as topic_ids from fb_conversations_topic_expertise_points left join fb_conversations_entity_actions_details on fb_conversations_topic_expertise_points.fb_conversations_topic_id = fb_conversations_entity_actions_details.entity_origin_id and fb_conversations_entity_actions_details.is_deleted = 0 and fb_conversations_entity_actions_details.fb_conversation_entity_type_lookup_id = 1 and fb_conversations_entity_actions_details.fb_conversation_actions_type_lookup_id = 8 and fb_conversations_entity_actions_details.user_id = fb_conversations_topic_expertise_points.expert_id where fb_conversations_topic_expertise_points.expert_id = ${params.user_id} and (fb_conversations_topic_expertise_points.expertise_point >= ${params.expertise_point} or fb_conversations_entity_actions_details.id is not null)) as topic_expert_details on JSON_CONTAINS(topic_expert_details.topic_ids,CONVERT(fb_conversations_topics.id,char)) = 1 left join fb_conversations_topic_questions on fb_conversations_topic_questions.fb_conversations_topic_id = fb_conversations_topics.id and fb_conversations_topic_questions.created_by != ${params.user_id} and not exists(SELECT fb_conversations_topic_question_id from fb_conversations_topic_questions_answers where fb_conversations_topic_questions_answers.fb_conversations_topic_question_id = fb_conversations_topic_questions.id and answered_by = ${params.user_id} and is_enabled=1 and is_deleted=0 limit 1) and fb_conversations_topic_questions.is_deleted = 0 left join users on users.id = fb_conversations_topic_questions.created_by and users.user_status = 'active' left join fb_conversations_entity_actions_details as fbead5 on fbead5.fb_conversation_actions_type_lookup_id = 3 and fbead5.fb_conversation_entity_type_lookup_id = 2 and fb_conversations_topic_questions.id = fbead5.entity_origin_id and fbead5.is_deleted = 0 and fbead5.user_id=${params.user_id} left join fb_conversations_entity_actions_details as fbead6 on fbead6.fb_conversation_actions_type_lookup_id = 7 and fbead6.fb_conversation_entity_type_lookup_id = 2 and fb_conversations_topic_questions.id = fbead6.entity_origin_id and fbead6.is_deleted = 0 and fbead6.user_id=${params.user_id} left join fb_conversations_topic_questions_answers on fb_conversations_topic_questions_answers.fb_conversations_topic_question_id = fb_conversations_topic_questions.id and fb_conversations_topic_questions_answers.is_enabled=1 and fb_conversations_topic_questions_answers.is_deleted=0 where fb_conversations_topics.is_enabled = 1 and fb_conversations_topics.is_deleted = 0 and (fb_conversations_topic_questions.id is null or fb_conversations_topic_questions.is_enabled = 1 or fbead5.user_id is not null or fbead6.user_id is not null) GROUP by fb_conversations_topic_questions.id order by fb_conversations_topic_questions.created_at DESC) as t`;
            const result = await this.sequelizeCon.query(sql);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    // public getUserIdWhoBookmarkedTopicByQuestionId = async (questionId) => {
    //     try {
    //         // tslint:disable-next-line: max-line-length
    //         const sql = `SELECT fb_conversations_entity_actions_details.user_id from fb_conversations_topic_questions inner join fb_conversations_entity_actions_details on fb_conversations_topic_questions.fb_conversations_topic_id = fb_conversations_entity_actions_details.entity_origin_id and fb_conversations_entity_actions_details.fb_conversation_entity_type_lookup_id = 1 and fb_conversations_entity_actions_details.fb_conversation_actions_type_lookup_id = 2 and fb_conversations_entity_actions_details.is_deleted = 0 and fb_conversations_topic_questions.is_enabled = 1
    //         and fb_conversations_topic_questions.is_deleted = 0 where fb_conversations_topic_questions.id = ${questionId}`;
    //         const result = await this.sequelizeCon.query(sql);
    //         return result[0].length > 0 ? result[0] : null;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    public markEntitySeen = async (params: IMarkEntitySeenEntity) => {
        try {
            // tslint:disable-next-line: max-line-length
            let isEntitytAlreadySeenQuery = `SELECT id from fb_conversation_entity_actions_details_seen where fb_conversation_entity_type_id=${params.entity_type_id} and parent_entity_origin_id=${params.parent_entity_origin_id} and user_id=${params.user_id} and is_deleted=0`;
            isEntitytAlreadySeenQuery += ` and entity_origin_id > ${params.entity_origin_id}`;
            isEntitytAlreadySeenQuery += ` order by id desc limit 1`;

            const isEntitytAlreadySeenResult = await this.sequelizeCon.query(isEntitytAlreadySeenQuery);
            if (isEntitytAlreadySeenResult[0].length === 0) {
                const sql = `INSERT into fb_conversation_entity_actions_details_seen(user_id,entity_origin_id,fb_conversation_entity_type_id,parent_entity_origin_id,created_at,updated_at) VALUES(${params.user_id},${params.entity_origin_id},${params.entity_type_id},${params.parent_entity_origin_id},CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`;
                const result = await this.sequelizeCon.query(sql);
                return result[0].length > 0 ? result[0] : null;
            }
        } catch (error) {
            throw error;
        }
    }

    public getEntityActionCountById = async (entity: IEntity) => {
        try {
            const query = `SELECT fb_conversations_entity_actions_count.fb_conversations_action_count as entity_action_count from fb_conversations_entity_actions_count where fb_conversations_entity_origin_id=${entity.entity_origin_id}
            and fb_conversations_entity_type_lookup_id=${entity.entity_type_id}
            and fb_conversations_action_type_lookup_id=${entity.entity_action_type_id}`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0][0].entity_action_count : 0;
        } catch (error) {
            throw error;
        }
    }

    private softDeleteRowsBeforeLastSeen = async (params: IMarkEntitySeenEntity) => {
        const softDeleteRowsBeforeLastSeenQuery = `UPDATE fb_conversation_entity_actions_details_seen set is_deleted=1,updated_at=CURRENT_TIMESTAMP where user_id=${params.user_id} and fb_conversation_entity_type_id=${params.entity_type_id}
        and fb_conversation_action_type_id=null and entity_origin_id=${params.entity_origin_id} and parent_entity_origin_id=${params.parent_entity_origin_id} and is_deleted=0`;
        await this.sequelizeCon.query(softDeleteRowsBeforeLastSeenQuery);
    }
}

export const fbConversationModelIns = new FBConversationModel();
