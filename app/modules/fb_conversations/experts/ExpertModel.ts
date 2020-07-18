import { sequelize } from '@app/config/Sequelize';
import { inputHelperIns } from '@app/modules/helper/InputHelper';
import { Sequelize } from 'sequelize';
import { IMarkEntitySeenEntity } from '../after-entity-actions/IMarkEntitySeenEntity';
import { IExpertPointUpdateEntity } from './IExpertPointUpdateEntity';
class ExpertModel {
    private sequelizeCon: Sequelize;
    constructor() {
        this.sequelizeCon = sequelize;
    }

    public getExpertsByTopic = async (params) => {
        try {
            // tslint:disable-next-line: max-line-length
            const query = `SELECT fb_conversations_topic_type_lookup.topic_name as
            topic_type_name,fb_conversations_topics.id as topic_id,
            fb_conversations_topics.topic as topic_name,
            fb_conversations_topic_expertise_points.expertise_point,
            count(fb_conversations_topic_questions_answers.id) as reply_count,
            users.id as user_id,users.name,users.profile from
            fb_conversations_topic_expertise_points inner join fb_conversations_topics
            on fb_conversations_topic_expertise_points.fb_conversations_topic_id=
            fb_conversations_topics.id inner join fb_conversations_topic_type_lookup
            on fb_conversations_topic_type_lookup.id =
            fb_conversations_topics.fb_conversations_topic_type_lookup_id and
            fb_conversations_topic_type_lookup.is_enabled=1 and
            fb_conversations_topic_type_lookup.is_deleted=0 inner join users on
            fb_conversations_topic_expertise_points.expert_id=users.id left join
            fb_conversations_topic_questions on fb_conversations_topic_questions.fb_conversations_topic_id =
            fb_conversations_topics.id and fb_conversations_topic_questions.is_enabled=1 and
            fb_conversations_topic_questions.is_deleted=0 left join fb_conversations_topic_questions_answers
            on fb_conversations_topic_questions_answers.fb_conversations_topic_question_id=
            fb_conversations_topic_questions.id and users.id=fb_conversations_topic_questions_answers.answered_by
            and fb_conversations_topic_questions_answers.is_enabled=1 and fb_conversations_topic_questions_answers.is_deleted=0
            left join fb_conversations_entity_actions_details on fb_conversations_topics.id =
            fb_conversations_entity_actions_details.entity_origin_id and
            fb_conversations_entity_actions_details.is_deleted=0 and
            fb_conversations_entity_actions_details.fb_conversation_entity_type_lookup_id=
            ${params.entity_Action_ids.entity_type_id} and fb_conversations_entity_actions_details.fb_conversation_actions_type_lookup_id=
            ${params.entity_Action_ids.entity_action_type_id} and fb_conversations_entity_actions_details.user_id=
            fb_conversations_topic_expertise_points.expert_id where fb_conversations_topics.is_enabled=1 and
            fb_conversations_topics.is_deleted=0 and users.user_status='ACTIVE' and
            fb_conversations_topics.id=${params.topic_id} and
            (fb_conversations_topic_expertise_points.expertise_point >=${params.expertise_point}
                or fb_conversations_entity_actions_details.id is not null)
                group by users.id order by fb_conversations_topic_expertise_points.expertise_point desc,
                fb_conversations_topic_expertise_points.id asc`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    public getListOfExpertiseTopics = async (params) => {
        try {
            // tslint:disable-next-line: max-line-length
            const query = `select expert_details_table.*,fb_conversations_topic_type_lookup.topic_name as topic_type_name,fb_conversations_topics.id as topic_id,fb_conversations_topics.topic as topic_name,fb_conversations_topic_metadata.metdata->'$.image' as topic_banner_image,sum(case when fb_conversations_topic_questions_answers.id is not null then 1 else 0 end) as reply_count,ifnull(fb_conversation_entity_actions_details_seen.id,0) as 'is_topic_expert_seen' from (select * from ( select expert_id,expertise_point,fb_conversations_topic_id,(case when @topicId != fb_conversations_topic_id and @topicId := fb_conversations_topic_id then @rank := 1 else @rank := @rank + 1 end) as expertise_rank,fb_conversations_topic_expertise_points_id from ( SELECT expert_id,expertise_point,fb_conversations_topic_id,fb_conversations_entity_actions_details.id,fb_conversations_topic_expertise_points.id as fb_conversations_topic_expertise_points_id from fb_conversations_topic_expertise_points left join fb_conversations_entity_actions_details on fb_conversations_topic_expertise_points.expert_id = fb_conversations_entity_actions_details.user_id and fb_conversations_entity_actions_details.entity_origin_id = fb_conversations_topic_expertise_points.fb_conversations_topic_id and fb_conversations_entity_actions_details.is_deleted = 0 and fb_conversations_entity_actions_details.fb_conversation_entity_type_lookup_id = ${params.entity_type_id} and fb_conversations_entity_actions_details.fb_conversation_actions_type_lookup_id = ${params.entity_action_type_id} where (fb_conversations_topic_expertise_points.expertise_point >= ${params.expertise_point} or fb_conversations_entity_actions_details.id is not null) order by fb_conversations_topic_expertise_points.fb_conversations_topic_id asc,fb_conversations_topic_expertise_points.expertise_point desc,fb_conversations_topic_expertise_points.id asc) as t inner join ( SELECT @rank := 0,@topicId := 0) as rank) as final_result where expert_id = ${params.user_id} order by fb_conversations_topic_expertise_points_id asc) as expert_details_table inner join fb_conversations_topics on fb_conversations_topics.id = expert_details_table.fb_conversations_topic_id inner join fb_conversations_topic_type_lookup on fb_conversations_topic_type_lookup.id = fb_conversations_topics.fb_conversations_topic_type_lookup_id left join fb_conversations_topic_metadata on fb_conversations_topics.id = fb_conversations_topic_metadata.fb_conversations_topic_id and fb_conversations_topic_metadata.is_enabled = 1 and fb_conversations_topic_metadata.is_deleted = 0 and fb_conversations_topic_metadata.metdata->'$.isBanner' = true left join fb_conversations_topic_questions on fb_conversations_topic_questions.fb_conversations_topic_id = fb_conversations_topics.id and fb_conversations_topic_questions.is_enabled = 1 and fb_conversations_topic_questions.is_deleted = 0 left join fb_conversations_topic_questions_answers on fb_conversations_topic_questions_answers.fb_conversations_topic_question_id = fb_conversations_topic_questions.id and fb_conversations_topic_questions_answers.is_enabled = 1 and fb_conversations_topic_questions_answers.is_deleted = 0 and fb_conversations_topic_questions_answers.answered_by = ${params.user_id} left join fb_conversation_entity_actions_details_seen on fb_conversation_entity_actions_details_seen.user_id = ${params.user_id} and fb_conversation_entity_actions_details_seen.fb_conversation_entity_type_id = 1 and fb_conversation_entity_actions_details_seen.entity_origin_id = expert_details_table.fb_conversations_topic_id and fb_conversation_entity_actions_details_seen.parent_entity_origin_id = expert_details_table.fb_conversations_topic_expertise_points_id where fb_conversations_topics.is_enabled = 1 and fb_conversations_topics.is_deleted = 0 group by fb_conversations_topics.id order by expertise_rank`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    public updateExpertiseCount = async (params: IExpertPointUpdateEntity) => {
        try {
            // tslint:disable-next-line: max-line-length
            const sql = `insert into fb_conversations_topic_expertise_points(fb_conversations_topic_id,expert_id,expertise_point,created_at,updated_at) VALUES(${params.fb_conversations_topic_id},${params.expert_id},${params.expertise_point},CURRENT_TIMESTAMP,CURRENT_TIMESTAMP) on duplicate key UPDATE expertise_point=expertise_point${params.operator}${params.expertise_point},updated_at=CURRENT_TIMESTAMP`;
            const result = await this.sequelizeCon.query(sql);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public updateExpertiseCountForTopic = async (params: IExpertPointUpdateEntity) => {
        try {
            // tslint:disable-next-line: max-line-length
            const sql = `insert into fb_conversations_topic_metadata_count(fb_conversations_topic_id,fb_conversations_topic_metadata_type_id,count,created_at,updated_at) VALUES(${params.fb_conversations_topic_id},3,1,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP) on duplicate key UPDATE count=count${params.operator}1,updated_at=CURRENT_TIMESTAMP`;
            const result = await this.sequelizeCon.query(sql);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public getExpertisePointForExpert = async (params: IExpertPointUpdateEntity) => {
        try {
            // const expertiseCountForExpersQuery = `SELECT expertise_point from fb_conversations_topic_expertise_points where expert_id=${params.expert_id} and fb_conversations_topic_id=${params.fb_conversations_topic_id}`;


            const expertiseCountForExpersQuery = `SELECT
            expertise_point,
            ifnull(fb_conversations_entity_actions_details.id,0) as is_expertise_claimed
        from
            fb_conversations_topic_expertise_points
        left join fb_conversations_entity_actions_details on
            fb_conversations_topic_expertise_points.fb_conversations_topic_id = fb_conversations_entity_actions_details.entity_origin_id
            and fb_conversations_topic_expertise_points.expert_id = fb_conversations_entity_actions_details.user_id
            and fb_conversations_entity_actions_details.is_deleted = 0
            and fb_conversations_entity_actions_details.fb_conversation_entity_type_lookup_id = 1
            and fb_conversations_entity_actions_details.fb_conversation_actions_type_lookup_id = 8
        where
            expert_id = ${params.expert_id}
            and fb_conversations_topic_id = ${params.fb_conversations_topic_id}`;

            const expertiseCountForExpersQueryResult = await this.sequelizeCon.query(expertiseCountForExpersQuery);
            return expertiseCountForExpersQueryResult[0].length > 0 ? expertiseCountForExpersQueryResult[0][0] : null;
        } catch (error) {
            throw error;
        }
    }

    public markTopicExpertsSeen = async (params: IMarkEntitySeenEntity[]) => {
        try {
            if (inputHelperIns.isArrayValidNNotEmpty(params)) {
                let expertiseCountForExpersQuery = `insert into fb_conversation_entity_actions_details_seen(user_id,fb_conversation_entity_type_id,entity_origin_id,is_deleted,parent_entity_origin_id,created_at,updated_at) values`;

                params.forEach((item) => {
                    expertiseCountForExpersQuery += `(${item.user_id},${item.entity_type_id},${item.entity_origin_id},0,${item.parent_entity_origin_id},CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),`;
                });
                expertiseCountForExpersQuery = expertiseCountForExpersQuery.substring(0, expertiseCountForExpersQuery.length - 1);
                const expertiseCountForExpersQueryResult = await this.sequelizeCon.query(expertiseCountForExpersQuery);
                return expertiseCountForExpersQueryResult;
            }
        } catch (error) {
            throw error;
        }
    }

    // public getTopicIdByAnswerIdForUpdateExpertisePoint = async (answerId) => {
    //     try {
    //         // tslint:disable-next-line: max-line-length
    //         const sql = `SELECT fb_conversations_topics.id as fb_conversations_topic_id from fb_conversations_topic_questions_answers inner join fb_conversations_topic_questions on fb_conversations_topic_questions_answers.fb_conversations_topic_question_id=fb_conversations_topic_questions.id inner join fb_conversations_topics on fb_conversations_topics.id=fb_conversations_topic_questions.fb_conversations_topic_id where fb_conversations_topic_questions_answers.id=${answerId} and fb_conversations_topic_questions_answers.is_enabled=1 and fb_conversations_topic_questions_answers.is_deleted=0 and fb_conversations_topic_questions.is_enabled=1 and fb_conversations_topic_questions.is_deleted=0 and fb_conversations_topics.is_enabled=1 and fb_conversations_topics.is_deleted=0`;
    //         const result = await this.sequelizeCon.query(sql);
    //         return result[0].length > 0 ? result[0][0] : null;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}

export const expertModelIns = new ExpertModel();
