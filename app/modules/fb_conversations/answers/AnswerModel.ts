import { sequelize } from '@app/config/Sequelize';
import { Sequelize } from 'sequelize';
import { IEntity } from '../IEntity';

class AnswerModel {
    private sequelizeCon: Sequelize;
    constructor() {
        this.sequelizeCon = sequelize;
    }

    public addAnswer = async (params) => {
        try {
            const query = `INSERT into fb_conversations_topic_questions_answers (answer,fb_conversations_topic_question_id,answered_by,created_at,updated_at) VALUES(?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`;
            const result = await this.sequelizeCon.query({ query, values: [params.answer, params.question_id, params.user_id] });
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public updateAnswer = async (params) => {
        try {
            const query = `update fb_conversations_topic_questions_answers set answer=?,updated_at=CURRENT_TIMESTAMP where fb_conversations_topic_question_id=? and answered_by=? and id=? and is_enabled=1 and is_deleted=0`;
            const result = await this.sequelizeCon.query({ query, values: [params.answer, params.question_id, params.user_id, params.answer_id] });
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public deleteAnswer = async (params) => {
        try {
            const query = `update fb_conversations_topic_questions_answers set is_deleted=1,updated_at=CURRENT_TIMESTAMP where fb_conversations_topic_question_id=${params.question_id} and answered_by=${params.user_id} and id=${params.answer_id} and is_enabled=1 and is_deleted=0`;
            const result = await this.sequelizeCon.query(query);
            return result[0].changedRows > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    public getAnswerListQuery = (params) => {

        // tslint:disable-next-line: max-line-length
        const query = `SELECT ifnull(fbctep.expertise_rank,0) as expertise_rank,(Case when fbead2.id is null then 0 else 1 end) as 'is_upvoted_by_you',fbead1.user_id as 'followed_by',users.name as questioned_by,users.id as questioned_by_id,users.profile as questioned_by_profile,u1.name as answered_by,u1.id as answered_by_id,u1.profile as answered_by_profile,fb_conversations_topic_questions.id as question_id,fb_conversations_topic_questions.question,fb_conversations_topic_questions_answers.id as answer_id,fb_conversations_topic_questions_answers.answer,fb_conversations_topic_questions.created_at as question_asked_at,fb_conversations_topic_questions_answers.created_at as answered_at,ifnull(fb_conversations_entity_actions_count.fb_conversations_action_count,0) as 'upvotes_count',fbead3.user_id as answer_reported_abused_by_id,fb_conversations_topic_questions_answers.is_enabled as is_answer_enabled,fbead4.user_id as answer_marked_irrelevant_by_id,fb_conversations_topic_questions_answers.is_enabled,fb_conversations_topics.topic as topic_name from fb_conversations_topic_questions inner join fb_conversations_topics on fb_conversations_topic_questions.fb_conversations_topic_id=fb_conversations_topics.id left join fb_conversations_topic_questions_answers on fb_conversations_topic_questions.id = fb_conversations_topic_questions_answers.fb_conversations_topic_question_id and fb_conversations_topic_questions_answers.is_deleted = 0 left join users on users.id = fb_conversations_topic_questions.created_by left join users as u1 on u1.id = fb_conversations_topic_questions_answers.answered_by left join fb_conversations_entity_actions_count on fb_conversations_entity_actions_count.fb_conversations_entity_type_lookup_id = ${params.entity_type_id} and fb_conversations_entity_actions_count.fb_conversations_action_type_lookup_id = ${params.entity_action_type_id} and fb_conversations_entity_actions_count.fb_conversations_entity_origin_id = fb_conversations_topic_questions_answers.id left join fb_conversations_entity_actions_details as fbead1 on fbead1.fb_conversation_actions_type_lookup_id = 5 and fbead1.fb_conversation_entity_type_lookup_id = 2 and fb_conversations_topic_questions.id = fbead1.entity_origin_id and fbead1.is_deleted = 0 and fbead1.user_id = ${params.user_id} left join fb_conversations_entity_actions_details as fbead2 on fbead2.fb_conversation_actions_type_lookup_id = ${params.entity_upvotes_action_type_id} and fbead2.fb_conversation_entity_type_lookup_id = ${params.answer_entity_type_id} and fb_conversations_topic_questions_answers.id = fbead2.entity_origin_id and fbead2.is_deleted = 0 and fbead2.user_id = ${params.user_id} left join fb_conversations_entity_actions_details as fbead3 on fbead3.fb_conversation_actions_type_lookup_id=3 and fbead3.fb_conversation_entity_type_lookup_id = 3 and fb_conversations_topic_questions_answers.id = fbead3.entity_origin_id and fbead3.is_deleted = 0 left join fb_conversations_entity_actions_details as fbead4 on fbead4.fb_conversation_actions_type_lookup_id=7 and fbead4.fb_conversation_entity_type_lookup_id = 3 and fb_conversations_topic_questions_answers.id = fbead4.entity_origin_id and fbead4.is_deleted = 0 left join ( select fb_conversations_topic_id,expert_id,expertise_point,(@rank := @rank + 1) as expertise_rank from fb_conversations_topic_expertise_points inner join ( select @rank := 0) as rt order by expertise_point desc limit 0,3) as fbctep on fbctep.expert_id = u1.id and fbctep.fb_conversations_topic_id = fb_conversations_topic_questions.fb_conversations_topic_id where fb_conversations_topic_questions.id = ${params.question_id} and fb_conversations_topic_questions.is_deleted = 0 and (fb_conversations_topic_questions_answers.id is null or fb_conversations_topic_questions_answers.is_enabled = 1 or fbead3.id is not null or fbead4.id is not null) and fb_conversations_topics.is_enabled=1 and fb_conversations_topics.is_deleted=0`;
        return query;
    }

    public getAnswerListWithCommentsQuery = (params) => {

        // tslint:disable-next-line: max-line-length
        const query = `SELECT count(c1.id) as comment_count,ifnull(fbctep1.expertise_rank, 0)                                               as commented_by_expertise_rank,fb_conversations_topics.id as topic_id,question_abs.user_id as question_abused_reported_user_id,
        question_irr.user_id as question_irrelevant_marked_user_id,comment_abs.user_id as comment_abused_reported_user_id,
        comment_irr.user_id as comment_irrelevant_marked_user_id,
        answer_abs.user_id as answer_abused_reported_user_id,
        answer_irr.user_id as answer_irrelevant_marked_user_id,ifnull(fbctep.expertise_rank,0) as expertise_rank,(Case when fbead2.id is null then 0 else 1 end) as 'is_upvoted_by_you',fbead1.user_id as 'followed_by',users.name as questioned_by,users.id as questioned_by_id,users.profile as questioned_by_profile,u1.name as answered_by,u1.id as answered_by_id,u1.profile as answered_by_profile,fb_conversations_topic_questions.id as question_id,fb_conversations_topic_questions.question,fb_conversations_topic_questions_answers.id as answer_id,fb_conversations_topic_questions_answers.answer,fb_conversations_topic_questions.created_at as question_asked_at,fb_conversations_topic_questions_answers.created_at as answered_at,ifnull(fb_conversations_entity_actions_count.fb_conversations_action_count,0) as 'upvotes_count',fb_conversations_topic_questions_answers.is_enabled as is_answer_enabled,fb_conversations_topic_questions_answers.is_enabled,fb_conversations_topics.topic as topic_name,fb_conversations_topic_questions_answers_comments.comment,fb_conversations_topic_questions_answers_comments.id as comment_id,u2.name as commented_by,u2.id as commented_by_id,u2.profile as commented_by_profile,fb_conversations_topic_questions_answers_comments.created_at as commented_at from fb_conversations_topic_questions inner join fb_conversations_topics on fb_conversations_topic_questions.fb_conversations_topic_id=fb_conversations_topics.id left join fb_conversations_topic_questions_answers on fb_conversations_topic_questions.id = fb_conversations_topic_questions_answers.fb_conversations_topic_question_id and fb_conversations_topic_questions_answers.is_deleted = 0 left join users on users.id = fb_conversations_topic_questions.created_by left join fb_conversations_topic_questions_answers_comments on fb_conversations_topic_questions_answers.id = fb_conversations_topic_questions_answers_comments.entity_origin_id and fb_conversations_topic_questions_answers_comments.fb_conversation_entity_type_lookup_id=3 and fb_conversations_topic_questions_answers_comments.is_deleted = 0 
left join fb_conversations_topic_questions_answers_comments as c1 on fb_conversations_topic_questions_answers_comments.id = c1.entity_origin_id and c1.fb_conversation_entity_type_lookup_id = 4 and  c1.is_deleted = 0 left join users as u1 on u1.id = fb_conversations_topic_questions_answers.answered_by left join users as u2 on u2.id = fb_conversations_topic_questions_answers_comments.commented_by left join fb_conversations_entity_actions_count on fb_conversations_entity_actions_count.fb_conversations_entity_type_lookup_id = ${params.entity_type_id} and fb_conversations_entity_actions_count.fb_conversations_action_type_lookup_id = ${params.entity_action_type_id} and fb_conversations_entity_actions_count.fb_conversations_entity_origin_id = fb_conversations_topic_questions_answers.id left join fb_conversations_entity_actions_details as fbead1 on fbead1.fb_conversation_actions_type_lookup_id = 5 and fbead1.fb_conversation_entity_type_lookup_id = 2 and fb_conversations_topic_questions.id = fbead1.entity_origin_id and fbead1.is_deleted = 0 and fbead1.user_id = ${params.user_id} left join fb_conversations_entity_actions_details as fbead2 on fbead2.fb_conversation_actions_type_lookup_id = ${params.entity_upvotes_action_type_id} and fbead2.fb_conversation_entity_type_lookup_id = ${params.answer_entity_type_id} and fb_conversations_topic_questions_answers.id = fbead2.entity_origin_id and fbead2.is_deleted = 0 and fbead2.user_id = ${params.user_id} left join fb_conversations_entity_actions_details as question_abs on
	question_abs.fb_conversation_actions_type_lookup_id = 3
	and question_abs.fb_conversation_entity_type_lookup_id = 2
	and fb_conversations_topic_questions.id = question_abs.entity_origin_id
	and question_abs.is_deleted = 0
	and (question_abs.user_id = ${params.user_id}
	or fb_conversations_topic_questions.created_by = ${params.user_id})
left join fb_conversations_entity_actions_details as question_irr on
	question_irr.fb_conversation_actions_type_lookup_id = 7
	and question_irr.fb_conversation_entity_type_lookup_id = 2
	and fb_conversations_topic_questions.id = question_irr.entity_origin_id
	and question_irr.is_deleted = 0
	and (question_irr.user_id = ${params.user_id}
	or fb_conversations_topic_questions.created_by = ${params.user_id}) left join fb_conversations_entity_actions_details as answer_abs on
	answer_abs.fb_conversation_actions_type_lookup_id = 3
	and answer_abs.fb_conversation_entity_type_lookup_id = 3
	and fb_conversations_topic_questions_answers.id = answer_abs.entity_origin_id
	and answer_abs.is_deleted = 0
	and (answer_abs.user_id = ${params.user_id}
	or fb_conversations_topic_questions_answers.answered_by = ${params.user_id})
left join fb_conversations_entity_actions_details as answer_irr on
	answer_irr.fb_conversation_actions_type_lookup_id = 7
	and answer_irr.fb_conversation_entity_type_lookup_id = 3
	and fb_conversations_topic_questions_answers.id = answer_irr.entity_origin_id
	and answer_irr.is_deleted = 0
	and (answer_irr.user_id = ${params.user_id}
	or fb_conversations_topic_questions_answers.answered_by = ${params.user_id})
left join fb_conversations_entity_actions_details as comment_abs on
	comment_abs.fb_conversation_actions_type_lookup_id = 3
	and comment_abs.fb_conversation_entity_type_lookup_id = 4
	and fb_conversations_topic_questions_answers_comments.id = comment_abs.entity_origin_id
	and comment_abs.is_deleted = 0
	and (comment_abs.user_id = ${params.user_id}
	or fb_conversations_topic_questions_answers_comments.commented_by = ${params.user_id})
left join fb_conversations_entity_actions_details as comment_irr on
	comment_irr.fb_conversation_actions_type_lookup_id = 7
	and comment_irr.fb_conversation_entity_type_lookup_id = 4
	and fb_conversations_topic_questions_answers_comments.id = comment_irr.entity_origin_id
	and comment_irr.is_deleted = 0
	and (comment_irr.user_id = ${params.user_id}
	or fb_conversations_topic_questions_answers_comments.commented_by = ${params.user_id}) left join (select *,(@rank := @rank + 1) as expertise_rank from (select
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
where fb_conversations_topic_expertise_points.fb_conversations_topic_id = ${params.topic_id} and (fb_conversations_topic_expertise_points.expertise_point >= ${params.expertise_point} or fb_conversations_entity_actions_details.id is not null) order by expertise_point desc,fb_conversations_topic_expertise_points.id asc limit 0,3) as t inner join ( select @rank := 0) as rt) as fbctep on fbctep.expert_id = u1.id and fbctep.fb_conversations_topic_id = fb_conversations_topic_questions.fb_conversations_topic_id

left join (select *,(@rank1 := @rank1 + 1) as expertise_rank from (select
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
where fb_conversations_topic_expertise_points.fb_conversations_topic_id = ${params.topic_id} and (fb_conversations_topic_expertise_points.expertise_point >= ${params.expertise_point} or fb_conversations_entity_actions_details.id is not null) order by expertise_point desc,fb_conversations_topic_expertise_points.id asc limit 0,3) as t inner join ( select @rank1 := 0) as rt) as fbctep1 on fbctep1.expert_id = u2.id and fbctep1.fb_conversations_topic_id = fb_conversations_topic_questions.fb_conversations_topic_id

where fb_conversations_topic_questions.id = ${params.question_id} and fb_conversations_topic_questions.is_deleted = 0 and (fb_conversations_topic_questions.is_enabled = 1
	or question_abs.id is not null
	or question_irr.id is not null) and (fb_conversations_topic_questions_answers.id is null or fb_conversations_topic_questions_answers.is_enabled = 1 or answer_abs.id is not null or answer_irr.id is not null) and (fb_conversations_topic_questions_answers_comments.id is null or fb_conversations_topic_questions_answers_comments.is_enabled = 1 or comment_abs.id is not null or comment_irr.id is not null) and fb_conversations_topics.is_enabled=1 and fb_conversations_topics.is_deleted=0 group by fb_conversations_topic_questions_answers.id,fb_conversations_topic_questions_answers_comments.id asc order by upvotes_count desc,fb_conversations_topic_questions_answers.id desc,fb_conversations_topic_questions_answers_comments.id asc`;
        return query;
    }

    public getAnswerListOrderByQuerySyntax = () => {
        return ' order by upvotes_count desc,fb_conversations_topic_questions_answers.id desc';
    }

    public getAnswerList = async (params) => {
        try {
            const query = this.getAnswerListWithCommentsQuery(params);
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public getAnswerNQuestionByQuestionId = async (params) => {
        try {
            // tslint:disable-next-line: max-line-length
            // const query = `SELECT users.name,fb_conversations_topic_questions.question,fb_conversations_topic_questions.id as question_id,fb_conversations_topic_questions_answers.id as answer_id,fb_conversations_topic_questions_answers.answer,ifnull(fb_conversations_entity_actions_count.fb_conversations_action_count,0) as upvotes_count,fb_conversations_topic_questions.id as question_id,fb_conversations_topic_questions.question from fb_conversations_topic_questions_answers inner join fb_conversations_topic_questions on fb_conversations_topic_questions.id=fb_conversations_topic_questions_answers.fb_conversations_topic_question_id left join fb_conversations_entity_actions_count on fb_conversations_entity_actions_count.fb_conversations_entity_origin_id=fb_conversations_topic_questions_answers.id and fb_conversations_entity_actions_count.fb_conversations_entity_type_lookup_id=(SELECT id from fb_conversations_entity_type_lookup where is_enabled=1 and is_deleted=0 and fb_conversation_enity_type='${params.entity_type}') and fb_conversations_entity_actions_count.fb_conversations_action_type_lookup_id=(SELECT id from fb_conversations_action_type_lookup where is_enabled=1 and is_deleted=0 and fb_conversations_action_type='${params.action_type}') inner join users on fb_conversations_topic_questions_answers.answered_by=users.id and users.user_status='active' where fb_conversations_topic_questions_answers.id=${params.answer_id} and fb_conversations_topic_questions.id=${params.question_id} and fb_conversations_topic_questions_answers.is_enabled=1 and fb_conversations_topic_questions_answers.is_deleted=0 and fb_conversations_topic_questions.is_enabled=1 and fb_conversations_topic_questions.is_deleted=0`;
            let query = this.getAnswerListQuery(params);
            query += ` and fb_conversations_topic_questions_answers.id=${params.answer_id}`;
            query += this.getAnswerListOrderByQuerySyntax();
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    public updateAnswerCount = async (params) => {
        try {
            const query = `INSERT into fb_conversations_topic_questions_answers (answer,fb_conversations_topic_question_id,answered_by,created_at,updated_at) VALUES('${params.answer}',${params.question_id},${params.user_id},CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public getAnswersGivenByYou = async (params) => {
        try {
            // tslint:disable-next-line: max-line-length
            const query = `SELECT (case when MONTH(fb_conversations_topic_questions_answers.created_at)= MONTH(CURRENT_DATE()) then 'This Month' when MONTH(fb_conversations_topic_questions_answers.created_at)= (MONTH(CURRENT_DATE())-1) then 'Last Month' else 'Earlier' end) as label,u1.profile as questioned_by_profile,u1.name as questioned_by,fb_conversations_topic_questions_answers.answer,fb_conversations_topic_questions_answers.id as answer_id,fb_conversations_topic_questions_answers.created_at as entity_created_at,fb_conversations_topic_questions.question,fb_conversations_topic_questions.id as question_id,fb_conversations_topic_questions.created_at as question_asked_at,fb_conversations_topic_questions.created_by as questioned_by_id,users.id as answered_by_id,users.name as answered_by,users.profile as answered_by_profile,fb_conversations_topics.topic as topic_name,fb_conversations_topic_metadata.metdata->'$.image' as topic_banner_image,ifnull(fb_conversations_entity_actions_count.fb_conversations_action_count,0) as upvotes_count,fb_conversations_entity_actions_details.user_id as upvoted_by,question_abs.user_id as question_abused_reported_user_id,question_irr.user_id as question_irrelevant_marked_user_id,answer_irr.user_id as answer_irrelevant_marked_user_id,answer_abs.user_id as answer_abused_reported_user_id from fb_conversations_topic_questions_answers inner join fb_conversations_topic_questions on fb_conversations_topic_questions_answers.fb_conversations_topic_question_id = fb_conversations_topic_questions.id inner join users on users.id = fb_conversations_topic_questions_answers.answered_by inner join users as u1 on u1.id = fb_conversations_topic_questions.created_by inner join fb_conversations_topics on fb_conversations_topics.id = fb_conversations_topic_questions.fb_conversations_topic_id left join fb_conversations_topic_metadata on fb_conversations_topics.id = fb_conversations_topic_metadata.fb_conversations_topic_id and fb_conversations_topic_metadata.metdata->'$.isBanner'= true left join fb_conversations_entity_actions_count on fb_conversations_entity_actions_count.fb_conversations_entity_origin_id=fb_conversations_topic_questions_answers.id and fb_conversations_entity_actions_count.fb_conversations_entity_type_lookup_id=${params.entity_type_id} and fb_conversations_entity_actions_count.fb_conversations_action_type_lookup_id=${params.entity_action_type_id} left join fb_conversations_entity_actions_details on fb_conversations_entity_actions_details.user_id = ${params.user_id} and fb_conversations_entity_actions_details.entity_origin_id = fb_conversations_topic_questions_answers.id and fb_conversations_entity_actions_details.fb_conversation_entity_type_lookup_id = ${params.entity_type_id} and fb_conversations_entity_actions_details.fb_conversation_actions_type_lookup_id = ${params.entity_action_type_id} and fb_conversations_entity_actions_details.is_deleted=0 left join fb_conversations_entity_actions_details as question_abs
                   on question_abs.fb_conversation_actions_type_lookup_id = 3 and
                      question_abs.fb_conversation_entity_type_lookup_id = 2 and
                      fb_conversations_topic_questions.id = question_abs.entity_origin_id and
                      question_abs.is_deleted = 0 and
                      (fb_conversations_topic_questions.created_by = ${params.user_id} or question_abs.user_id = ${params.user_id})
         left join fb_conversations_entity_actions_details as question_irr
                   on question_irr.fb_conversation_actions_type_lookup_id = 7 and
                      question_irr.fb_conversation_entity_type_lookup_id = 2 and
                      fb_conversations_topic_questions.id = question_irr.entity_origin_id and
                      question_irr.is_deleted = 0 and
                      (fb_conversations_topic_questions.created_by = ${params.user_id} or question_irr.user_id = ${params.user_id})
         left join fb_conversations_entity_actions_details as answer_abs
                   on answer_abs.fb_conversation_actions_type_lookup_id = 3 and
                      answer_abs.fb_conversation_entity_type_lookup_id = 3 and
                      fb_conversations_topic_questions_answers.id = answer_abs.entity_origin_id and
                      answer_abs.is_deleted = 0 and
                      (fb_conversations_topic_questions_answers.answered_by = ${params.user_id} or answer_abs.user_id = ${params.user_id})
         left join fb_conversations_entity_actions_details as answer_irr
                   on answer_irr.fb_conversation_actions_type_lookup_id = 7 and
                      answer_irr.fb_conversation_entity_type_lookup_id = 3 and
                      fb_conversations_topic_questions_answers.id = answer_irr.entity_origin_id and
                      answer_irr.is_deleted = 0 and (fb_conversations_topic_questions_answers.answered_by = ${params.user_id} or answer_irr.user_id = ${params.user_id}) where fb_conversations_topic_questions_answers.answered_by = ${params.user_id} and fb_conversations_topic_questions.is_deleted = 0 and fb_conversations_topic_questions_answers.is_deleted = 0 and fb_conversations_topics.is_enabled = 1 and fb_conversations_topics.is_deleted = 0 and (fb_conversations_topic_questions_answers.is_enabled = 1 or answer_abs.user_id is not null or answer_irr.user_id is not null) and (fb_conversations_topic_questions.is_enabled = 1 or question_irr.user_id is not null or question_abs.user_id is not null) group by fb_conversations_topic_questions.id order by fb_conversations_topic_questions_answers.created_at desc`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    public disableAnswer = async (params) => {
        try {
            const query = `update fb_conversations_topic_questions_answers set is_enabled=0,updated_at=CURRENT_TIMESTAMP where id=${params.answer_id} and is_enabled=1`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public enableAnswer = async (params) => {
        try {
            const query = `update fb_conversations_topic_questions_answers set is_enabled=1,updated_at=CURRENT_TIMESTAMP where id=${params.answer_id} and is_enabled=0`;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public getIrrelevantCountByAnsId = async (entity: IEntity) => {
        try {
            const query = `SELECT fb_conversations_entity_actions_count.fb_conversations_action_count as answer_irrelevant_cnt from fb_conversations_entity_actions_count where fb_conversations_entity_origin_id=${entity.entity_origin_id}
            and fb_conversations_entity_type_lookup_id=${entity.entity_type_id}
            and fb_conversations_action_type_lookup_id=${entity.entity_action_type_id}`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0][0].answer_irrelevant_cnt : 0;
        } catch (error) {
            throw error;
        }
    }

    public getAnswerDetailsByAnswerId = async (answerId) => {
        try {
            // tslint:disable-next-line: max-line-length
            const query = `SELECT users.name as user_name,fb_conversations_topics.topic as topic_name,fb_conversations_topics.id as topic_id,fb_conversations_topic_questions_answers.answered_by,fb_conversations_topic_questions.created_by as question_asked_by_id,fb_conversations_topic_questions_answers.fb_conversations_topic_question_id as question_id,fb_conversations_topic_questions_answers.id as answer_id from fb_conversations_topic_questions_answers inner join fb_conversations_topic_questions on fb_conversations_topic_questions_answers.fb_conversations_topic_question_id = fb_conversations_topic_questions.id inner join fb_conversations_topics on fb_conversations_topics.id = fb_conversations_topic_questions.fb_conversations_topic_id inner join users on users.id=fb_conversations_topic_questions_answers.answered_by and users.user_status='active' where fb_conversations_topic_questions_answers.is_deleted=0 and fb_conversations_topic_questions_answers.is_enabled=1 and fb_conversations_topic_questions.is_enabled=1 and fb_conversations_topic_questions.is_deleted=0 and fb_conversations_topics.is_enabled=1 and fb_conversations_topics.is_deleted=0 and fb_conversations_topic_questions_answers.id=${answerId}`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0][0] : null;
        } catch (error) {
            throw error;
        }
    }

    public getUserDetailsWhoUpvotedAnswer = async (params) => {
        try {
            // tslint:disable-next-line: max-line-length
            const query = `SELECT users.name as user_name,users.id from users inner join fb_conversations_entity_actions_details on users.id=fb_conversations_entity_actions_details.user_id
            where fb_conversations_entity_actions_details.entity_origin_id=${params.answer_id}
            and fb_conversations_entity_actions_details.is_deleted=0
            and fb_conversations_entity_actions_details.fb_conversation_entity_type_lookup_id=3
            and fb_conversations_entity_actions_details.fb_conversation_actions_type_lookup_id=1
            and fb_conversations_entity_actions_details.user_id=${params.user_id}`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0][0] : null;
        } catch (error) {
            throw error;
        }
    }
}
export const answerModelIns = new AnswerModel();
