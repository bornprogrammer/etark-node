import { sequelize } from '@app/config/Sequelize';
import ErrorFactory from '@app/errors/ErrorFactory';
import { TokenNotSentError } from '@app/errors/TokenNotSentError';
import { Sequelize } from 'sequelize';
import { TopicMetadataTypeEnum } from './TopicMetadataTypeEnum';
import { stringBuilderHelperIns } from '@app/modules/helper/StringBuilderHelper';

export class TopicModel {
    private sequelizeCon: Sequelize;
    private aws = 'https://foodybuddyrik.s3-ap-southeast-1.amazonaws.com/uploads';
    constructor() {
        this.sequelizeCon = sequelize;
    }

    public getPopularTopicType = async () => {
        try {
            const sql = `select id,topic_type,topic_name,
            CONCAT('${this.aws}','/fb_conversation/',img_url) as img_url,description
            from fb_conversations_topic_type_lookup
            where is_enabled=1 and is_deleted=0`;
            const result = await this.sequelizeCon.query(sql);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public getCommunityExpertsCount = async () => {
        try {
            const sql = `select SUM(tmc.count) as experts_count
            from fb_conversations_topic_metadata_count as tmc
            inner join fb_conversations_topic_metadata_type as tmt on
            tmc.fb_conversations_topic_metadata_type_id=tmt.id and tmt.is_deleted=0 and tmt.is_enabled=1
            inner join fb_conversations_topics as t on tmc.fb_conversations_topic_id=t.id and t.is_deleted=0 and t.is_enabled=1
            where tmt.fb_conversations_topic_metadata_name='experts'`;
            const result = await this.sequelizeCon.query(sql);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public getTopicTypeLookUp = async () => {
        try {
            const sql = `select id, topic_name, topic_type
            from fb_conversations_topic_type_lookup
            where is_enabled=1 and is_deleted=0`;
            const result = await this.sequelizeCon.query(sql);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public createUserTopic = async (data: any) => {
        try {
            const sql = `INSERT INTO foody_buddy.fb_conversation_user_topics
            (topic_name, description, topic_type_lookup_id, created_by, status, created_at, updated_at)
            VALUES('${data.topic_name}', '${data.topic_description}', ${data.topic_type_id},
            ${data.user_id}, 'PENDING', NOW(), NOW())`;
            const result = await this.sequelizeCon.query(sql);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public getTopic = async (params: any) => {
        try {
            let sql = `SELECT
            fb_conversations_topics.id as topic_id,
            fb_conversations_topics.topic as topic_name,
            ifnull(expert_count_table.count,
            0) as experts_count,
            ifnull(question_count_table.count,
            0) as discussion_counts,
            sum(case when fb_conversations_topic_questions_answers.id is not null then 1 else 0 end) as reply_count,
            fb_conversations_topic_metadata.metdata->'$.image' as topic_banner_image,
            ifnull(fb_conversations_entity_actions_details.id,0) as bookmarked_id
        from
            fb_conversations_topics
        left join fb_conversations_topic_metadata on
            fb_conversations_topics.id = fb_conversations_topic_metadata.fb_conversations_topic_id
            and fb_conversations_topic_metadata.metdata->'$.isBanner' = true
            and fb_conversations_topic_metadata.is_enabled = 1
            and fb_conversations_topic_metadata.is_deleted = 0
        left join fb_conversations_topic_metadata_count as expert_count_table on
            fb_conversations_topics.id = expert_count_table.fb_conversations_topic_id
            and expert_count_table.fb_conversations_topic_metadata_type_id = 3
        left join fb_conversations_topic_metadata_count as question_count_table on
            fb_conversations_topics.id = question_count_table.fb_conversations_topic_id
            and question_count_table.fb_conversations_topic_metadata_type_id = 4
        left join fb_conversations_topic_questions on
            fb_conversations_topic_questions.fb_conversations_topic_id = fb_conversations_topics.id
            and fb_conversations_topic_questions.is_enabled = 1
            and fb_conversations_topic_questions.is_deleted = 0
        left join fb_conversations_topic_questions_answers on
            fb_conversations_topic_questions.id = fb_conversations_topic_questions_answers.fb_conversations_topic_question_id
            and fb_conversations_topic_questions_answers.is_enabled = 1
            and fb_conversations_topic_questions_answers.is_deleted = 0
        left join fb_conversations_entity_actions_details on
            fb_conversations_entity_actions_details.entity_origin_id = fb_conversations_topics.id
            and fb_conversations_entity_actions_details.is_deleted=0
            and fb_conversations_entity_actions_details.user_id=${params.user_id}
            and fb_conversations_entity_actions_details.fb_conversation_entity_type_lookup_id=1
            and fb_conversations_entity_actions_details.fb_conversation_actions_type_lookup_id=2
          where fb_conversations_topics.fb_conversations_topic_type_lookup_id=${params.topic_type_id}
          and fb_conversations_topics.is_enabled=1 and fb_conversations_topics.is_deleted=0`;
            sql += params.topic_name ? ` and fb_conversations_topics.topic like '%${params.topic_name}%'` : '';
            sql += ` group by fb_conversations_topics.id order by discussion_counts desc,reply_count desc`;
            const result = await this.sequelizeCon.query(sql);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    /*public getTopic = async (data: any) => {
        try {
            let sql = `select t.id as topic_id, t.topic as topic_name,IFNULL(tep.count, 0) as experts_count,
            IFNULL(que.count, 0) as discussion_counts,reply.ans_cnt as reply_count,
            IF(IFNULL(bm.id,0),1,0) as is_bookmarked,
            CONCAT('${this.aws}','/gallery/',TRIM(BOTH '"' FROM im.img_url)) as topic_banner_image_url
            from fb_conversations_topics as t
            inner join fb_conversations_topic_type_lookup as ttl on t.fb_conversations_topic_type_lookup_id=ttl.id
            LEFT join fb_conversations_topic_metadata_count as tep on tep.fb_conversations_topic_id=t.id 
            and tep.fb_conversations_topic_metadata_type_id=(select id from fb_conversations_topic_metadata_type 
            where fb_conversations_topic_metadata_name='experts')
            LEFT join fb_conversations_topic_metadata_count as que on que.fb_conversations_topic_id=t.id 
            and que.fb_conversations_topic_metadata_type_id=(select id from fb_conversations_topic_metadata_type 
            where fb_conversations_topic_metadata_name='questions')
            left join (select top.id as topic_id,IFNULL(COUNT(tqa.id),0) as ans_cnt 
            from fb_conversations_topics as top
            left join fb_conversations_topic_questions as tq on tq.fb_conversations_topic_id=top.id
            and tq.is_deleted=0 and tq.is_enabled=1
            left join fb_conversations_topic_questions_answers as tqa on tqa.fb_conversations_topic_question_id=tq.id
            and tqa.is_deleted=0 and tqa.is_enabled=1
            and tqa.id > (select IFNULL((select entity_origin_id
            from fb_conversation_entity_actions_details_seen
            where fb_conversation_entity_type_id= (select id from fb_conversations_entity_type_lookup
               where fb_conversation_enity_type='answer') and
               fb_conversation_action_type_id = (select id from fb_conversations_action_type_lookup
               where fb_conversations_action_type = 'seen') and user_id=${data.user_id}
               ORDER by id DESC LIMIT 1),0))
            where top.is_deleted=0 and top.is_enabled=1 
            group by top.id) as reply on reply.topic_id=t.id
            left join (select * from fb_conversations_entity_actions_details
            where fb_conversation_entity_type_lookup_id=(select id from fb_conversations_entity_type_lookup where fb_conversation_enity_type='topic')
            and fb_conversation_actions_type_lookup_id=(select id from fb_conversations_action_type_lookup where fb_conversations_action_type='bookmark')
            and user_id=${data.user_id} and is_deleted=0) as bm on bm.entity_origin_id=t.id
            left join (select tm.fb_conversations_topic_id,tm.metdata->'$.image' as img_url from fb_conversations_topic_metadata as tm 
                inner join fb_conversations_topic_metadata_type as tmt on tm.fb_conversations_topic_metadata_type_id=tmt.id
                and tmt.is_enabled=1 and tmt.is_deleted=0
               where tmt.metadata_type_name='Images' and tm.metdata->'$.isBanner'=TRUE) as im on im.fb_conversations_topic_id=t.id
            where t.is_deleted=0 and t.is_enabled=1 and ttl.id=${data.topic_type_id}`;
            if (data.topic_name) {
                sql += ` and t.topic like '%${data.topic_name}%'`;
            }
            sql += ` group by t.id order by t.id`;
            const result = await this.sequelizeCon.query(sql);
            return result[0];
        } catch (error) {
            throw error;
        }
    }*/

    public searchTopic = async (data: any) => {
        try {
            let sql = `select t.id as topic_id, t.topic as topic_name,IFNULL(tep.count, 0) as experts_count,
            IFNULL(que.count, 0) as discussion_counts,reply.ans_cnt as reply_count,
            IF(IFNULL(bm.id,0),1,0) as is_bookmarked,
            CONCAT('${this.aws}','/gallery/',TRIM(BOTH '"' FROM im.img_url)) as topic_banner_image_url
            from fb_conversations_topics as t
            inner join fb_conversations_topic_type_lookup as ttl on t.fb_conversations_topic_type_lookup_id=ttl.id
            LEFT join fb_conversations_topic_metadata_count as tep on tep.fb_conversations_topic_id=t.id 
            and tep.fb_conversations_topic_metadata_type_id=(select id from fb_conversations_topic_metadata_type 
            where fb_conversations_topic_metadata_name='experts')
            LEFT join fb_conversations_topic_metadata_count as que on que.fb_conversations_topic_id=t.id 
            and que.fb_conversations_topic_metadata_type_id=(select id from fb_conversations_topic_metadata_type 
            where fb_conversations_topic_metadata_name='questions')
            left join (select top.id as topic_id,IFNULL(COUNT(tqa.id),0) as ans_cnt 
            from fb_conversations_topics as top
            left join fb_conversations_topic_questions as tq on tq.fb_conversations_topic_id=top.id
            and tq.is_deleted=0 and tq.is_enabled=1
            left join fb_conversations_topic_questions_answers as tqa on tqa.fb_conversations_topic_question_id=tq.id
            and tqa.is_deleted=0 and tqa.is_enabled=1
            and tqa.id > (select IFNULL((select entity_origin_id 
            from fb_conversation_entity_actions_details_seen
            where fb_conversation_entity_type_id= (select id from fb_conversations_entity_type_lookup
               where fb_conversation_enity_type='answer') and
               fb_conversation_action_type_id = (select id from fb_conversations_action_type_lookup
               where fb_conversations_action_type = 'seen') and user_id=${data.user_id}
               ORDER by id DESC LIMIT 1),0))
            where top.is_deleted=0 and top.is_enabled=1 
            group by top.id) as reply on reply.topic_id=t.id
            left join (select * from fb_conversations_entity_actions_details
            where fb_conversation_entity_type_lookup_id=(select id from fb_conversations_entity_type_lookup where fb_conversation_enity_type='topic')
            and fb_conversation_actions_type_lookup_id=(select id from fb_conversations_action_type_lookup where fb_conversations_action_type='bookmark')
            and user_id=${data.user_id} and is_deleted=0) as bm on bm.entity_origin_id=t.id
            left join (select tm.fb_conversations_topic_id,(select ug.image from user_gallery as ug 
                where ug.tag_id=tm.metdata->'$.dish_tag_id'
                order by ug.rating DESC LIMIT 1) as img_url
                from fb_conversations_topic_metadata as tm
                where tm.is_deleted=0 and tm.is_enabled=1
                and tm.fb_conversations_topic_metadata_type_id=1
               GROUP by tm.fb_conversations_topic_id) as im on im.fb_conversations_topic_id=t.id
            where t.is_deleted=0 and t.is_enabled=1`;
            if (data.topic_name) {
                sql += ` and t.topic like '%${data.topic_name}%'`;
            }
            sql += ` group by t.id order by t.id`;
            const result = await this.sequelizeCon.query(sql);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public getTopicDetails = async (data: any) => {
        try {
            const sql = `SELECT
            fb_conversations_topics.id as topic_id,
            fb_conversations_topics.topic as topic_name,
            fb_conversations_topic_metadata.metdata as metadata,
            fb_conversations_topic_metadata_type.fb_conversations_topic_metadata_name as metadata_type,
            fb_conversations_topic_metadata_type.metadata_type_name as metadata_name,
            fb_conversations_topic_metadata.id as metadata_id,
            dish_tag.name as dish_tag_name,
            dish_tag.id as dish_tag_id,
            IFNULL(fb_conversations_entity_actions_details.id, 0) as is_bookmarked,
            ifnull(fb_conversations_topic_metadata_count.count,0) as experts_count,
            notification_subscriber.id as topic_subscribed_id,
            fb_conversations_topic_type_lookup.topic_name as topic_type_name
        from
            fb_conversations_topics
            inner join fb_conversations_topic_type_lookup on fb_conversations_topics.fb_conversations_topic_type_lookup_id= fb_conversations_topic_type_lookup.id and fb_conversations_topic_type_lookup.is_enabled=1 and fb_conversations_topic_type_lookup.is_deleted=0
        inner join fb_conversations_topic_metadata on
            fb_conversations_topics.id = fb_conversations_topic_metadata.fb_conversations_topic_id
        inner join fb_conversations_topic_metadata_type on
            fb_conversations_topic_metadata.fb_conversations_topic_metadata_type_id = fb_conversations_topic_metadata_type.id
        left join dish_tag on
            fb_conversations_topic_metadata.fb_conversations_topic_metadata_type_id =1 and dish_tag.id = fb_conversations_topic_metadata.metdata->>'$.dish_tag_id'
            left join fb_conversations_topic_metadata_count on
            fb_conversations_topic_metadata_count.fb_conversations_topic_id=fb_conversations_topics.id
            and fb_conversations_topic_metadata_count.fb_conversations_topic_metadata_type_id=3
        left join fb_conversations_entity_actions_details on
        fb_conversations_entity_actions_details.user_id=${data.user_id}
        and fb_conversations_entity_actions_details.fb_conversation_entity_type_lookup_id=${data.entity_type_id}
        and fb_conversations_entity_actions_details.fb_conversation_actions_type_lookup_id=${data.entity_action_type_id}
        and fb_conversations_entity_actions_details.is_deleted=0
        and fb_conversations_entity_actions_details.entity_origin_id=${data.topic_id}
        left join notification_subscriber on notification_subscriber.entity_origin_id=fb_conversations_topics.id
        and notification_subscriber.user_id=${data.user_id} and notification_subscriber.notifications_events_lookup_id=1 and notification_subscriber.is_subscribed=1 and notification_subscriber.fb_conversation_entity_type_lookup_id=${data.entity_type_id}
        where
            fb_conversations_topics.is_enabled = 1
            and fb_conversations_topics.is_deleted = 0
            and fb_conversations_topic_metadata.is_enabled = 1
            and fb_conversations_topic_metadata.is_deleted = 0
            and fb_conversations_topics.id = ${data.topic_id}
            and fb_conversations_topic_metadata_type.is_enabled = 1
            and fb_conversations_topic_metadata_type.is_deleted = 0`;
            const result = await this.sequelizeCon.query(sql);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    public getExpertsProfile = async (data: any) => {
        try {
            const sql = `select users.id as user_ids,users.profile,fb_conversations_topic_expertise_points.fb_conversations_topic_id from fb_conversations_topic_expertise_points
        inner join users on
            fb_conversations_topic_expertise_points.expert_id = users.id
        left join fb_conversations_entity_actions_details on
            fb_conversations_topic_expertise_points.fb_conversations_topic_id = fb_conversations_entity_actions_details.entity_origin_id
            and fb_conversations_entity_actions_details.is_deleted = 0
            and fb_conversations_entity_actions_details.fb_conversation_entity_type_lookup_id = 1
            and fb_conversations_entity_actions_details.fb_conversation_actions_type_lookup_id = 8
            and fb_conversations_entity_actions_details.user_id=fb_conversations_topic_expertise_points.expert_id
        where
            users.user_status = 'active'
            and fb_conversations_topic_id = ${data.topic_id}
            and (fb_conversations_topic_expertise_points.expertise_point >= ${data.expertise_point}
            or fb_conversations_entity_actions_details.id is not null) order by expertise_point desc limit 4`;
            const result = await this.sequelizeCon.query(sql);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    public getUserBookmarkTopics = async (data: any) => {
        try {
            const sql = `select
            'Bookmarked Topics' as title,
            IFNULL(bookmarked_topics_table.bookmarked_topics_counts, 0) as total,
            CONCAT('${this.aws}','/fb_conversation/','bookmarked_topic.png') as img_url,
            IFNULL(sum(case when fb_conversations_topic_questions.id >
                question_seen_details_table.question_id or question_seen_details_table.parent_entity_origin_id is null then 1 else 0 end), 0) 
            as new_unseen
        from
            (
            SELECT
                count(*) as bookmarked_topics_counts,
                JSON_ARRAYAGG(entity_origin_id) as bookmarked_topics
            from
                fb_conversations_entity_actions_details
            where
                fb_conversation_entity_type_lookup_id = 1
                and fb_conversation_actions_type_lookup_id = 2
                and user_id = ${data.user_id}
                and is_deleted = 0
            group by
                user_id) as bookmarked_topics_table
        inner join fb_conversations_topic_questions on
            json_contains(bookmarked_topics_table.bookmarked_topics,
            CONVERT(fb_conversations_topic_questions.fb_conversations_topic_id,
            char))= 1
            and fb_conversations_topic_questions.is_enabled=1
          and fb_conversations_topic_questions.is_deleted=0
        left join (
            SELECT
                max(entity_origin_id) as question_id,
                parent_entity_origin_id
            from
                fb_conversation_entity_actions_details_seen
            where
                fb_conversation_entity_actions_details_seen.fb_conversation_entity_type_id = 2
                and fb_conversation_entity_actions_details_seen.user_id = ${data.user_id}
            group by
                parent_entity_origin_id) as question_seen_details_table on
            fb_conversations_topic_questions.fb_conversations_topic_id = question_seen_details_table.parent_entity_origin_id`;
            const result = await this.sequelizeCon.query(sql);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public getUserBookmarkQuestion = async (data: any) => {
        try {
            const sql = `select
             'Questions Following' as title,
             CONCAT('${this.aws}','/fb_conversation/','question_following.png') as img_url,
            IFNULL(following_question_counts,0) as total,
            IFNULL(sum(case when fb_conversations_topic_questions_answers.id is not null && (fb_conversations_topic_questions_answers.id > answer_seen_details_table.answer_id  or answer_seen_details_table.parent_entity_origin_id is null) then 1 else 0 end),
	0) as new_unseen
        from
            (
            SELECT
                count(*) as following_question_counts,
                JSON_ARRAYAGG(entity_origin_id) as following_question_ids
            from
                fb_conversations_entity_actions_details
            where
                fb_conversation_entity_type_lookup_id = 2
                and fb_conversation_actions_type_lookup_id = 5
                and user_id = ${data.user_id}
                and is_deleted = 0
            group by
                user_id) as following_questions
        left join fb_conversations_topic_questions_answers on
            json_contains(following_questions.following_question_ids,
            CONVERT(fb_conversations_topic_questions_answers.fb_conversations_topic_question_id,
            char))= 1
            and fb_conversations_topic_questions_answers.is_enabled = 1
            and fb_conversations_topic_questions_answers.is_deleted = 0
        left join (
            SELECT
                max(entity_origin_id) as answer_id,
                parent_entity_origin_id,
                fb_conversation_entity_actions_details_seen.id
            from
                fb_conversation_entity_actions_details_seen
            where
                fb_conversation_entity_actions_details_seen.fb_conversation_entity_type_id = 3
                and fb_conversation_entity_actions_details_seen.user_id = ${data.user_id}
            group by
                parent_entity_origin_id) as answer_seen_details_table on
            fb_conversations_topic_questions_answers.fb_conversations_topic_question_id =
            answer_seen_details_table.parent_entity_origin_id`;
            const result = await this.sequelizeCon.query(sql);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public getUserQuestionAnswers = async (data: any) => {
        try {
            const sql = `SELECT
            'Questions Answered by You' as title,
            count(DISTINCT fb_conversations_topic_questions.id) as total,
            IFNULL(sum(fb_conversations_entity_actions_count.fb_conversations_action_count), 0) as new_unseen,
            CONCAT('${this.aws}','/fb_conversation/','question_answerd_by_you.png') as img_url
        from
            fb_conversations_topic_questions
        left join fb_conversations_topic_questions_answers ON
            fb_conversations_topic_questions_answers.fb_conversations_topic_question_id = fb_conversations_topic_questions.id
            and fb_conversations_topic_questions_answers.is_enabled=1
            and fb_conversations_topic_questions_answers.is_deleted=0
        left join fb_conversations_entity_actions_count
        on fb_conversations_topic_questions_answers.id=fb_conversations_entity_actions_count.fb_conversations_entity_origin_id
        and fb_conversations_entity_actions_count.fb_conversations_entity_type_lookup_id=3
        and fb_conversations_entity_actions_count.fb_conversations_action_type_lookup_id=1
        where fb_conversations_topic_questions.is_enabled=1
        and fb_conversations_topic_questions.is_deleted=0
        and fb_conversations_topic_questions_answers.answered_by=${data.user_id}`;
            const result = await this.sequelizeCon.query(sql);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public getBookmarkedTopics = async (params: any) => {
        try {
            const sql = stringBuilderHelperIns(this.getBookmarkedTopicsQueryStr(params)).append(this.getBookmarkedTopicsGroupByStr()).append(this.getBookmarkedTopicsQuerySortingStr()).build();
            const result = await this.sequelizeCon.query(sql);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public getTopicDetailsByTopicId = async (params: any) => {
        try {
            // tslint:disable-next-line: max-line-length
            const query = `SELECT fb_conversations_topics.topic as topic_name,fb_conversations_topics.id as topic_id,fb_conversations_topic_type_lookup.topic_name as topic_type_name,fb_conversations_topic_type_lookup.topic_type from fb_conversations_topics inner join fb_conversations_topic_type_lookup on fb_conversations_topics.fb_conversations_topic_type_lookup_id = fb_conversations_topic_type_lookup.id where fb_conversations_topics.is_enabled = 1 and fb_conversations_topics.is_deleted = 0 and fb_conversations_topics.id=${params.topic_id}`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0][0] : null;
        } catch (error) {
            throw error;
        }
    }

    public getBookmarkedTopicsWithFilters = async (params: any) => {
        try {
            const sql = stringBuilderHelperIns(this.getBookmarkedTopicsQueryStr(params)).append(`and fb_conversations_topic_type_lookup.id=${params.topic_type_id}`).append(params.topic_name ? ` and fb_conversations_topics.topic like '%${params.topic_name}%'` : '').append(this.getBookmarkedTopicsGroupByStr()).append(this.getBookmarkedTopicsQuerySortingStr()).build();
            const result = await this.sequelizeCon.query(sql);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public getBookmarkedTopicsMonthWise = async (params: any) => {
        try {
            let sql = this.getBookmarkedTopicsQueryStr(params);
            sql += ` and fb_conversations_topic_type_lookup.id=${params.topic_type_id}`;
            sql += this.getBookmarkedTopicsQuerySortingStr();
            const result = await this.sequelizeCon.query(sql);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public getTopicMetadataIdByType = async (params: string[]) => {
        const query = `SELECT id,fb_conversations_topic_metadata_name from fb_conversations_topic_metadata_type where fb_conversations_topic_metadata_name in ('${params.join("','")}')`;
        const result = await this.sequelizeCon.query(query);
        return result[0];
    }

    public getTopicCount = async (params) => {
        const query = `SELECT count(id) as new_topic_count from fb_conversations_topics where is_enabled=1 and is_deleted=0
        and datediff('${params.curdate}',created_at)<=7`;
        const result = await this.sequelizeCon.query(query);
        return result[0][0].new_topic_count;
    }

    public getTopicImages = async (data: any) => {
        const sql = `select ug.image as images
        from fb_conversations_topic_metadata as tm
        LEFT join user_gallery as ug on ug.tag_id=tm.metdata->'$.dish_tag_id'
        where tm.fb_conversations_topic_metadata_type_id=1
        and tm.is_deleted=0 and is_enabled=1
        and tm.fb_conversations_topic_id=${data.topic_id}
        and ug.is_deleted=0
        order by ug.rating DESC
        LIMIT ${data.limit}`;
        const result = await this.sequelizeCon.query(sql);
        return result[0];
    }

    // public updateBookmarkedTopicSeen = async (data: any) => {
    //     try {

    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // public updateBookmarkedQuestionSeen = async (data: any) => {
    //     try {

    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // public updateQuestionsAnswerSeen = async (data: any) => {
    //     try {

    //     } catch (error) {
    //         throw error;
    //     }
    // }

    private getBookmarkedTopicsQueryStr = (params: any): string => {
        const expertIdKey = TopicMetadataTypeEnum.EXPERTS + '_id';
        const questionIdKey = TopicMetadataTypeEnum.QUESTIONS + '_id';
        // tslint:disable-next-line: max-line-length
        const sql = `SELECT fb_conversations_topics.id as topic_id,fb_conversations_entity_actions_details.created_at as entity_created_at,fb_conversations_topics.topic as topic_name,fb_conversations_topic_type_lookup.topic_name as topic_type_name,fb_conversations_topic_type_lookup.id as topic_type_id,ifnull(fb_conversations_topic_metadata_count.count,0) as experts_count,sum(case when fb_conversations_topic_questions.id is not null and (fb_conversations_topic_questions.id > question_seen_details_table.question_id or question_seen_details_table.parent_entity_origin_id is null) then 1 else 0 end) as discussion_counts,fb_conversations_topic_metadata.metdata->'$.image' as topic_banner_image from fb_conversations_topics inner join fb_conversations_topic_type_lookup on fb_conversations_topics.fb_conversations_topic_type_lookup_id = fb_conversations_topic_type_lookup.id inner join fb_conversations_entity_actions_details on fb_conversations_topics.id = fb_conversations_entity_actions_details.entity_origin_id and fb_conversations_entity_actions_details.fb_conversation_entity_type_lookup_id = ${params.entity_type_id} and fb_conversations_entity_actions_details.fb_conversation_actions_type_lookup_id = ${params.entity_action_type_id} 
        and fb_conversations_entity_actions_details.is_deleted=0
        left join fb_conversations_topic_questions on
        fb_conversations_topic_questions.fb_conversations_topic_id = fb_conversations_topics.id
        and fb_conversations_topic_questions.is_enabled = 1
        and fb_conversations_topic_questions.is_deleted = 0 left join (
            SELECT
                max(entity_origin_id) as question_id,
                parent_entity_origin_id
            from
                fb_conversation_entity_actions_details_seen
            where
                fb_conversation_entity_actions_details_seen.fb_conversation_entity_type_id = 2
                and fb_conversation_entity_actions_details_seen.user_id = ${params.user_id}
            group by
                parent_entity_origin_id) as question_seen_details_table on
            fb_conversations_topic_questions.fb_conversations_topic_id = question_seen_details_table.parent_entity_origin_id left join fb_conversations_topic_metadata_count on fb_conversations_topics.id = fb_conversations_topic_metadata_count.fb_conversations_topic_id and fb_conversations_topic_metadata_count.fb_conversations_topic_metadata_type_id=${params[expertIdKey]}
       left join fb_conversations_topic_metadata on
        fb_conversations_topics.id = fb_conversations_topic_metadata.fb_conversations_topic_id
        and fb_conversations_topic_metadata.metdata->'$.isBanner' = true where fb_conversations_topics.is_enabled=1 and fb_conversations_topics.is_deleted=0 and fb_conversations_topic_type_lookup.is_enabled=1 and fb_conversations_topic_type_lookup.is_deleted = 0 and fb_conversations_entity_actions_details.user_id=${params.user_id} `;
        return sql;
    }

    private getBookmarkedTopicsGroupByStr = () => {
        return 'GROUP by fb_conversations_topics.id';
    }

    private getBookmarkedTopicsQuerySortingStr = () => {
        const sortingSqlStr = `order by fb_conversations_entity_actions_details.created_at desc`;
        return sortingSqlStr;
    }


}

export const topicModelIns = new TopicModel();
