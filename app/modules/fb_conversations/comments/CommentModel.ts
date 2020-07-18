import { sequelize } from '@app/config/Sequelize';
import { Sequelize } from 'sequelize';
import { IEntityStatusChangeParams } from '../IEntityStatusChangeParams';

class CommentModel {
    private sequelizeCon: Sequelize;
    constructor() {
        this.sequelizeCon = sequelize;
    }

    public addComment = async (params) => {
        try {
            const query = `INSERT into fb_conversations_topic_questions_answers_comments(comment,commented_by,entity_origin_id,fb_conversation_entity_type_lookup_id,created_at,updated_at) values(?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`;
            const result = await this.sequelizeCon.query({ query, values: [params.comment, params.user_id, params.entity_origin_id, params.entity_type_id] });
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public updateComment = async (params) => {
        try {
            const query = `UPDATE fb_conversations_topic_questions_answers_comments set comment=? where id=? and commented_by=? and is_enabled=1 and is_deleted=0`;
            const result = await this.sequelizeCon.query({ query, values: [params.comment, params.comment_id, params.user_id] });
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public deleteComment = async (params) => {
        try {
            const query = `UPDATE fb_conversations_topic_questions_answers_comments set is_deleted=1 where id=? and commented_by=? and is_enabled=1 and is_deleted=0`;
            const result = await this.sequelizeCon.query({ query, values: [params.comment_id, params.user_id] });
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public updateCommentStatus = async (params: IEntityStatusChangeParams) => {
        try {
            const query = `UPDATE fb_conversations_topic_questions_answers_comments set is_enabled=${params.status} where id=? and is_deleted=0`;
            const result = await this.sequelizeCon.query({ query, values: [params.entity_id] });
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public getCommentList = async (params) => {
        try {
            const query = `select count(c1.id) as comment_count,ifnull(fbctep.expertise_rank,0) as expertise_rank,comment_abs.user_id as comment_abused_reported_user_id,comment_irr.user_id as comment_irrelevant_marked_user_id,users.name as commented_by,users.id as commented_by_id,users.profile,fb_conversations_topic_questions_answers_comments.id as comment_id,fb_conversations_topic_questions_answers_comments.comment,fb_conversations_topic_questions_answers_comments.created_at as date from fb_conversations_topic_questions_answers_comments inner join users on fb_conversations_topic_questions_answers_comments.commented_by=users.id
            left join fb_conversations_topic_questions_answers_comments as c1 on
             fb_conversations_topic_questions_answers_comments.id=c1.entity_origin_id
            and c1.fb_conversation_entity_type_lookup_id=4
            and c1.is_deleted=0
            and c1.is_enabled=1
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
              or fb_conversations_topic_questions_answers_comments.commented_by = ${params.user_id})
      left join (select *,(@rank := @rank + 1) as expertise_rank from (select
              fb_conversations_topic_id,
              expert_id,
              expertise_point
      from
              fb_conversations_topic_expertise_points
      left join fb_conversations_entity_actions_details on
              fb_conversations_entity_actions_details.fb_conversation_entity_type_lookup_id = 1
              and fb_conversations_entity_actions_details.fb_conversation_actions_type_lookup_id = 8
              and fb_conversations_entity_actions_details.entity_origin_id = 1
          and fb_conversations_entity_actions_details.user_id = fb_conversations_topic_expertise_points.expert_id
          and fb_conversations_entity_actions_details.is_deleted=0
      where fb_conversations_topic_expertise_points.fb_conversations_topic_id = 1 and (fb_conversations_topic_expertise_points.expertise_point >= ${params.expertise_point} or fb_conversations_entity_actions_details.id is not null) order by expertise_point desc,fb_conversations_topic_expertise_points.id asc limit 0,3) as t inner join ( select @rank := 0) as rt) as fbctep on fbctep.expert_id = users.id and fbctep.fb_conversations_topic_id =${params.topic_id}
      where users.user_status='active'
      and fb_conversations_topic_questions_answers_comments.entity_origin_id=${params.comment_id}
      and (fb_conversations_topic_questions_answers_comments.is_enabled=1 or comment_abs.id is not null or comment_irr.id is not null)
      and fb_conversations_topic_questions_answers_comments.is_deleted=0
      and fb_conversations_topic_questions_answers_comments.fb_conversation_entity_type_lookup_id=4 group by fb_conversations_topic_questions_answers_comments.id asc`;
            const result = await this.sequelizeCon.query({ query, values: [params.comment, params.commented_by, params.answer_id] });
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public getCommentDetails = async (params) => {
        try {
            // tslint:disable-next-line: max-line-length
            const query = `SELECT fb_conversations_topic_questions_answers_comments.comment,fb_conversations_topic_questions_answers_comments.id as comment_id,users.name as user_name,fb_conversations_topic_questions_answers_comments.commented_by,fb_conversations_topic_questions_answers.id as answer_id,fb_conversations_topic_questions_answers.answer,fb_conversations_topic_questions_answers.answered_by,fb_conversations_topic_questions.id as question_id,fb_conversations_topic_questions.question,fb_conversations_topic_questions.created_by from fb_conversations_topic_questions_answers_comments inner join fb_conversations_topic_questions_answers on fb_conversations_topic_questions_answers_comments.entity_origin_id = fb_conversations_topic_questions_answers.id and fb_conversations_topic_questions_answers_comments.fb_conversation_entity_type_lookup_id=3 inner join fb_conversations_topic_questions on fb_conversations_topic_questions.id=fb_conversations_topic_questions_answers.fb_conversations_topic_question_id inner join fb_conversations_topics on fb_conversations_topics.id = fb_conversations_topic_questions.fb_conversations_topic_id inner join users on fb_conversations_topic_questions_answers_comments.commented_by = users.id and users.user_status='active' where fb_conversations_topic_questions_answers_comments.is_enabled=1 and fb_conversations_topic_questions_answers_comments.is_deleted=0 and fb_conversations_topic_questions_answers.is_enabled=1 and fb_conversations_topic_questions_answers.is_deleted=0 and fb_conversations_topic_questions.is_enabled=1 and fb_conversations_topic_questions.is_deleted=0 and fb_conversations_topics.is_enabled=1 and fb_conversations_topics.is_deleted=0 and fb_conversations_topic_questions_answers_comments.id=${params.comment_id}`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0][0] : null;
        } catch (error) {
            throw error;
        }
    }
}

export const commentModelIns = new CommentModel();
