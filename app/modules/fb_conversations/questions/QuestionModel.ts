
import { UserStatus } from '@app/app-const/UserStatus';
import { sequelize } from '@app/config/Sequelize';
import { DateHelper } from '@app/modules/helper/DateHelper';
import { Sequelize } from 'sequelize';
import { IEntity } from '../IEntity';

export class QuestionModel {
    private sequelizeCon: Sequelize;
    constructor() {
        this.sequelizeCon = sequelize;
    }

    public addQuestion = async (params) => {
        try {
            const query = `INSERT into fb_conversations_topic_questions(question,created_by,fb_conversations_topic_id,created_at,updated_at) VALUES(?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`;
            const result = await this.sequelizeCon.query({ query, values: [params.question, params.user_id, params.topic_id] });
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public updateQuestion = async (params) => {
        try {
            const query = `update fb_conversations_topic_questions set question=?,updated_at=CURRENT_TIMESTAMP where id=? and created_by=? and is_enabled=1 and is_deleted=0 and fb_conversations_topic_id=?`;
            const result = await this.sequelizeCon.query({ query, values: [params.question, params.question_id, params.user_id, params.topic_id] });
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public deleteQuestion = async (params) => {
        try {
            const query = `update fb_conversations_topic_questions set updated_at=CURRENT_TIMESTAMP,is_enabled=0,is_deleted=1 where id=${params.question_id} and created_by=${params.user_id} and is_enabled=1 and is_deleted=0 and fb_conversations_topic_id=${params.topic_id}`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public getQuestionFillers = async () => {
        try {
            const query = `SELECT questions_filler from fb_conversations_topic_questions_filler where is_enabled=1 and is_deleted=0`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    public getQuestionList = async (params) => {
        try {
            // tslint:disable-next-line: max-line-length
            const query = `SELECT fb_conversations_topic_questions.question,fb_conversations_topic_questions.id from fb_conversations_topic_questions inner join fb_conversations_topics on fb_conversations_topics.id=fb_conversations_topic_questions.fb_conversations_topic_id where fb_conversations_topic_questions.is_enabled=1 and fb_conversations_topic_questions.is_deleted=0 and fb_conversations_topics.is_enabled=1 and fb_conversations_topics.is_deleted=0 and fb_conversations_topics.id in (${params.topic_ids}) order by id desc`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    public getTopThreeTopicsForExperts = async (userId) => {
        try {
            // tslint:disable-next-line: max-line-length
            const query = `SELECT id from fb_conversations_topic_expertise_points where expert_id=${userId} and expertise_point >=10 order by expertise_point desc limit 0,3`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    public getQuestionWithMostVotedAnswers = async (params) => {
        try {
            // tslint:disable-next-line: max-line-length
            const query = `SELECT *,count(answer_id) as answer_cnt from (SELECT u1.name as answered_by,question_abs.user_id     as question_abused_reported_user_id,
                question_irr.user_id as question_irrelevant_marked_user_id,
                answer_abs.user_id as answer_abused_marked_user_id,
                answer_irr.user_id as answer_irrelevant_marked_user_id,fb_conversations_topic_questions.id as question_id,fb_conversations_topic_questions.question,fb_conversations_topic_questions_answers.id as answer_id,fb_conversations_topic_questions_answers.answer,fb_conversations_topic_questions.is_enabled as is_question_enabled,fb_conversations_topic_questions.fb_conversations_topic_id,fb_conversations_topic_questions.created_by as questioned_by_id,fb_conversations_topics.id as topic_id,fb_conversations_topic_questions_answers.is_enabled as is_answer_enabled,fb_conversations_topic_questions_answers.answered_by as answer_by_id,fb_conversations_topic_questions_answers.created_at as answered_at,ifnull(fbctep.expertise_rank,0) as expertise_rank,fbead1.user_id as followed_by,fbead2.id as is_upvoted_by_you,users.name as questioned_by,users.profile as questioned_by_profile,u1.profile as answered_by_profile,fb_conversations_topic_questions.created_at as question_asked_at,ifnull (fb_conversations_entity_actions_count.fb_conversations_action_count,0) as 'upvotes_count' from fb_conversations_topic_questions inner join fb_conversations_topics on fb_conversations_topics.id = fb_conversations_topic_questions.fb_conversations_topic_id left join fb_conversations_topic_questions_answers on fb_conversations_topic_questions.id = fb_conversations_topic_questions_answers.fb_conversations_topic_question_id and fb_conversations_topic_questions_answers.is_deleted = 0 left join fb_conversations_entity_actions_count on fb_conversations_entity_actions_count.fb_conversations_entity_type_lookup_id = 3 and fb_conversations_entity_actions_count.fb_conversations_action_type_lookup_id = 1 and fb_conversations_entity_actions_count.fb_conversations_entity_origin_id = fb_conversations_topic_questions_answers.id left join users on users.id = fb_conversations_topic_questions.created_by left join users as u1 on u1.id = fb_conversations_topic_questions_answers.answered_by left join fb_conversations_entity_actions_details as fbead1 on fbead1.fb_conversation_actions_type_lookup_id = 5 and fbead1.fb_conversation_entity_type_lookup_id = 2 and fbead1.entity_origin_id = fb_conversations_topic_questions.id and fbead1.is_deleted = 0 and fbead1.user_id = ${params.user_id} left join fb_conversations_entity_actions_details as fbead2 on fbead2.fb_conversation_actions_type_lookup_id = 1 and fbead2.fb_conversation_entity_type_lookup_id = 3 and fbead2.entity_origin_id = fb_conversations_topic_questions_answers.id and fbead2.is_deleted = 0 and fbead2.user_id = ${params.user_id} left join fb_conversations_entity_actions_details as question_abs on
	question_abs.fb_conversation_actions_type_lookup_id = 3
	and question_abs.fb_conversation_entity_type_lookup_id = 2
	and question_abs.entity_origin_id = fb_conversations_topic_questions.id
	and question_abs.is_deleted = 0
	and (question_abs.user_id = ${params.user_id}
	or fb_conversations_topic_questions.created_by = ${params.user_id})
left join fb_conversations_entity_actions_details as question_irr on
	question_irr.fb_conversation_actions_type_lookup_id = 7
	and question_irr.fb_conversation_entity_type_lookup_id = 2
	and question_irr.entity_origin_id = fb_conversations_topic_questions.id
	and question_irr.is_deleted = 0
	and (question_irr.user_id = ${params.user_id}
	or fb_conversations_topic_questions.created_by = ${params.user_id})
left join fb_conversations_entity_actions_details as answer_abs on
	answer_abs.fb_conversation_actions_type_lookup_id = 3
	and answer_abs.fb_conversation_entity_type_lookup_id = 3
	and answer_abs.entity_origin_id = fb_conversations_topic_questions_answers.id
	and answer_abs.is_deleted = 0
	and (answer_abs.user_id = ${params.user_id}
	or fb_conversations_topic_questions_answers.answered_by = ${params.user_id})
left join fb_conversations_entity_actions_details as answer_irr on
	answer_irr.fb_conversation_actions_type_lookup_id = 7
	and answer_irr.fb_conversation_entity_type_lookup_id = 3
	and answer_irr.entity_origin_id = fb_conversations_topic_questions_answers.id
	and answer_irr.is_deleted = 0 and (answer_irr.user_id = ${params.user_id} or fb_conversations_topic_questions_answers.answered_by = ${params.user_id}) left join (select *,(@rank := @rank + 1) as expertise_rank from (select
        fb_conversations_topic_id,
        expert_id,
        expertise_point
from
        fb_conversations_topic_expertise_points
left join fb_conversations_entity_actions_details on
        fb_conversations_entity_actions_details.fb_conversation_entity_type_lookup_id = 1
        and fb_conversations_entity_actions_details.fb_conversation_actions_type_lookup_id = 8
        and fb_conversations_entity_actions_details.entity_origin_id = ${params.topic_id}
        and fb_conversations_entity_actions_details.user_id = fb_conversations_topic_expertise_points.expert_id
        and fb_conversations_entity_actions_details.is_deleted=0
where fb_conversations_topic_expertise_points.fb_conversations_topic_id = ${params.topic_id} and (fb_conversations_topic_expertise_points.expertise_point >= ${params.expertise_point} or fb_conversations_entity_actions_details.id is not null) order by expertise_point desc,fb_conversations_topic_expertise_points.id asc limit 0,3) as t inner join ( select @rank := 0) as rt) as fbctep on fbctep.expert_id = u1.id and fbctep.fb_conversations_topic_id = fb_conversations_topic_questions.fb_conversations_topic_id where fb_conversations_topics.is_enabled = 1 and fb_conversations_topics.id = ${params.topic_id} and fb_conversations_topics.is_deleted = 0 and fb_conversations_topic_questions.is_deleted = 0 and (fb_conversations_topic_questions.is_enabled = 1 or question_abs.user_id is not null or question_irr.user_id is not null) and (fb_conversations_topic_questions_answers.is_enabled = 1 or answer_abs.user_id is not null or answer_irr.user_id is not null or fb_conversations_topic_questions_answers.id is null) group by fb_conversations_topic_questions.id desc,fb_conversations_topic_questions_answers.id desc order by fb_conversations_topic_questions.id desc,fb_conversations_entity_actions_count.fb_conversations_action_count desc,fb_conversations_topic_questions_answers.id desc) as question_answer_details group by question_id desc order by upvotes_count desc,question_id asc`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    public getQuestionsFollowedByYou = async (params) => {
        try {
            // tslint:disable-next-line: max-line-length
            let query = `SELECT fb_conversations_topic_questions.question,fb_conversations_topic_questions.id as question_id,
            fb_conversations_entity_actions_details.created_at as entity_created_at,fb_conversations_topics.topic as topic_name,
            fb_conversations_topics.id as topic_id,count(fb_conversations_topic_questions_answers.id) as new_answer_count,
            fb_conversations_topic_metadata.metdata->'$.image' as topic_banner_image from fb_conversations_entity_actions_details
            inner join fb_conversations_topic_questions
            on fb_conversations_entity_actions_details.entity_origin_id = fb_conversations_topic_questions.id
            and fb_conversations_entity_actions_details.fb_conversation_entity_type_lookup_id =${params.entity_type_id}
            and fb_conversations_entity_actions_details.fb_conversation_actions_type_lookup_id = ${params.entity_action_type_id}
            inner join fb_conversations_topics
            on fb_conversations_topic_questions.fb_conversations_topic_id = fb_conversations_topics.id
            left join fb_conversations_topic_metadata
            on fb_conversations_topic_metadata.fb_conversations_topic_id = fb_conversations_topics.id
            and fb_conversations_topic_metadata.metdata->'$.isBanner' = true
            left join fb_conversations_topic_questions_answers
            on fb_conversations_topic_questions_answers.fb_conversations_topic_question_id = fb_conversations_topic_questions.id
            and fb_conversations_topic_questions_answers.id > ifnull((SELECT entity_origin_id
            from fb_conversation_entity_actions_details_seen where fb_conversation_entity_type_id = 3 and user_id=${params.user_id}
            and parent_entity_origin_id = fb_conversations_topic_questions.id order by id desc limit 1),0)
            and fb_conversations_topic_questions_answers.is_enabled=1 and fb_conversations_topic_questions_answers.is_deleted=0
            where fb_conversations_entity_actions_details.user_id = ${params.user_id} and fb_conversations_topics.is_enabled = 1
            and fb_conversations_topics.is_deleted = 0 and fb_conversations_entity_actions_details.is_deleted = 0`;
            query += params.question_str ? ` and fb_conversations_topic_questions.question like  '%${params.question_str}%'` : '';
            query += ` group by fb_conversations_topic_questions.id order by fb_conversations_entity_actions_details.created_at desc`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    public getQuestionsOfTopicYouAreExpertIn = async (params) => {
        try {
            // tslint:disable-next-line: max-line-length
            const query = `select count(fb_conversations_topic_questions_answers.id) as answer_count,topic_expert_details.topic_cnt,topic_expert_details.topic_ids,fb_conversations_topics.topic as topic_name,fb_conversations_topics.id as topic_id,fb_conversations_topic_questions.question,fb_conversations_topic_questions.id as question_id,users.name as questioned_by,users.id as questioned_by_id,users.profile,fb_conversations_topic_questions.created_at,question_abs.user_id as question_abused_reported_user_id,question_irr.user_id as question_irrelevant_marked_user_id from fb_conversations_topics inner join (SELECT COUNT(fb_conversations_topic_expertise_points.fb_conversations_topic_id) as topic_cnt,json_arrayagg(fb_conversations_topic_expertise_points.fb_conversations_topic_id) as topic_ids from fb_conversations_topic_expertise_points left join fb_conversations_entity_actions_details on fb_conversations_topic_expertise_points.fb_conversations_topic_id = fb_conversations_entity_actions_details.entity_origin_id and fb_conversations_entity_actions_details.is_deleted = 0 and fb_conversations_entity_actions_details.fb_conversation_entity_type_lookup_id = 1 and fb_conversations_entity_actions_details.fb_conversation_actions_type_lookup_id = 8 and fb_conversations_entity_actions_details.user_id = fb_conversations_topic_expertise_points.expert_id where fb_conversations_topic_expertise_points.expert_id = ${params.user_id} and (fb_conversations_topic_expertise_points.expertise_point >= ${params.expertise_point} or fb_conversations_entity_actions_details.id is not null)) as topic_expert_details on JSON_CONTAINS(topic_expert_details.topic_ids,CONVERT(fb_conversations_topics.id,char)) = 1 left join fb_conversations_topic_questions on fb_conversations_topic_questions.fb_conversations_topic_id = fb_conversations_topics.id and fb_conversations_topic_questions.created_by != ${params.user_id} and not exists(SELECT fb_conversations_topic_question_id from fb_conversations_topic_questions_answers where fb_conversations_topic_questions_answers.fb_conversations_topic_question_id = fb_conversations_topic_questions.id and answered_by = ${params.user_id} and is_enabled=1 and is_deleted=0 limit 1) and fb_conversations_topic_questions.is_deleted = 0 left join users on users.id = fb_conversations_topic_questions.created_by and users.user_status = 'active' left join fb_conversations_entity_actions_details as question_abs
                         on question_abs.fb_conversation_actions_type_lookup_id = 3 and
                            question_abs.fb_conversation_entity_type_lookup_id = 2 and
                            fb_conversations_topic_questions.id = question_abs.entity_origin_id and
                            question_abs.is_deleted = 0 and
                            (fb_conversations_topic_questions.created_by = ${params.user_id} or question_abs.user_id = ${params.user_id})
            left join fb_conversations_entity_actions_details as question_irr
                         on question_irr.fb_conversation_actions_type_lookup_id = 7 and question_irr.fb_conversation_entity_type_lookup_id = 2 and fb_conversations_topic_questions.id = question_irr.entity_origin_id and question_irr.is_deleted = 0 and (fb_conversations_topic_questions.created_by = ${params.user_id} or question_irr.user_id = ${params.user_id}) left join fb_conversations_topic_questions_answers on fb_conversations_topic_questions_answers.fb_conversations_topic_question_id = fb_conversations_topic_questions.id and fb_conversations_topic_questions_answers.is_enabled=1 and fb_conversations_topic_questions_answers.is_deleted=0 where fb_conversations_topics.is_enabled = 1 and fb_conversations_topics.is_deleted = 0 and (fb_conversations_topic_questions.id is null or fb_conversations_topic_questions.is_enabled = 1 or question_abs.user_id is not null or question_irr.user_id is not null) GROUP by fb_conversations_topic_questions.id order by fb_conversations_topic_questions.created_at DESC`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    public disableQuestion = async (params) => {
        try {
            const query = `update fb_conversations_topic_questions set is_enabled=0,updated_at=CURRENT_TIMESTAMP where id=${params.question_id}`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public enableQuestion = async (params) => {
        try {
            const query = `update fb_conversations_topic_questions set is_enabled=1,updated_at=CURRENT_TIMESTAMP where id=${params.question_id}`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public getQuestionDetails = async (questionId) => {
        try {
            // tslint:disable-next-line: max-line-length
            const query = `SELECT users.name as user_name,question,created_by,fb_conversations_topic_id as topic_id from fb_conversations_topic_questions inner join fb_conversations_topics on fb_conversations_topics.id = fb_conversations_topic_questions.fb_conversations_topic_id inner join users on users.id=fb_conversations_topic_questions.created_by where fb_conversations_topic_questions.id = ${questionId} and fb_conversations_topic_questions.is_deleted = 0 and fb_conversations_topics.is_enabled = 1 and fb_conversations_topics.is_deleted = 0 and users.user_status='${UserStatus.USER_STATUS_ACTIVE}'`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0][0] : null;
        } catch (error) {
            throw error;
        }
    }

    public getIrrelevantCountByQuestionId = async (params: IEntity) => {
        try {
            // tslint:disable-next-line: max-line-length
            const query = `SELECT fb_conversations_action_count as question_irrelevant_cnt from fb_conversations_entity_actions_count where fb_conversations_entity_origin_id=${params.entity_origin_id}
            and fb_conversations_entity_type_lookup_id=${params.entity_type_id}
            and fb_conversations_action_type_lookup_id=${params.entity_action_type_id}`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0][0].question_irrelevant_cnt : 0;
        } catch (error) {
            throw error;
        }
    }

    public getUnAnsweredQuestionCount = async () => {
        try {
            // tslint:disable-next-line: max-line-length
            const query = `SELECT count(fb_conversations_topic_questions.id) as unanswer_question_count from fb_conversations_topic_questions LEFT JOIN fb_conversations_topic_questions_answers on  fb_conversations_topic_questions.id = fb_conversations_topic_questions_answers.fb_conversations_topic_question_id and fb_conversations_topic_questions_answers.is_enabled=1 and fb_conversations_topic_questions_answers.is_deleted=0 where fb_conversations_topic_questions_answers.id is NULL`;
            const result = await this.sequelizeCon.query(query);
            return result[0][0];
        } catch (error) {
            throw error;
        }
    }

    public askQuestion = async (data: any) => {
        try {
            const sql = `INSERT INTO foody_buddy.fb_conversation_user_questions
            (user_id, question, topic, status, is_enabled, is_deleted, created_at, updated_at)
            VALUES(${data.user_id}, '${data.question}', '${data.topic}', 'PENDING', 1, 0,
            CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
            const result = await this.sequelizeCon.query(sql);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public getMostResponsedQuestion = async () => {
        try {
            const sql = `select users.name,fb_conversations_topic_questions.id as question_id,fb_conversations_topics.topic as topic_name,fb_conversations_topics.id as topic_id,fb_conversations_topic_questions.question,fb_conversations_topic_questions.created_by,count(fb_conversations_topic_questions_answers.id) as answer_count from fb_conversations_topic_questions inner join fb_conversations_topics on
            fb_conversations_topics.id=fb_conversations_topic_questions.fb_conversations_topic_id
            inner join users on
            users.id=fb_conversations_topic_questions.created_by
            left join fb_conversations_topic_questions_answers on
        fb_conversations_topic_questions.id=fb_conversations_topic_questions_answers.fb_conversations_topic_question_id
        and fb_conversations_topic_questions_answers.is_enabled=1
        and fb_conversations_topic_questions_answers.is_deleted=0
        where fb_conversations_topic_questions.is_enabled=1
        and fb_conversations_topics.is_enabled=1
        and fb_conversations_topics.is_deleted=0
        and fb_conversations_topic_questions.is_deleted=0
        and datediff('${DateHelper.getCurrentDateTimeAsMysqlStr()}',fb_conversations_topic_questions.created_at)<=1
        and users.user_status='${UserStatus.USER_STATUS_ACTIVE}'
        group by fb_conversations_topic_questions.id
        order by answer_count desc,fb_conversations_topic_questions.id asc limit 1`;
            const result = await this.sequelizeCon.query(sql);
            console.log(result[0]);
            return result[0].length > 0 ? result[0][0] : null;
        } catch (error) {
            throw error;
        }
    }
}

export const questionModelIns = new QuestionModel();
