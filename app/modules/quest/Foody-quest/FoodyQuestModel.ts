import { sequelize } from '@app/config/Sequelize';
import { DateHelper } from '@app/modules/helper/DateHelper';
import { Sequelize } from 'sequelize';
class FoodyQuestModel {
    private sequelizeCon: Sequelize;
    constructor() {
        this.sequelizeCon = sequelize;
    }

    public getFoodyQuestTaskDetails = async () => {
        try {

            const curDate = DateHelper.getCurrentDateAsMysqlStr();
            // tslint:disable-next-line: max-line-length
            const query = `SELECT foody_quest.id as foody_quest_id,ifnull(foody_track_user_quest.is_completed,0) as is_completed,foody_track_user_quest.id as foody_track_user_quest_id,ifnull(foody_track_user_quest.current_metric_count,0) as current_metric_count,foody_quest.start_date,task.goal,task.duration,metric.metric_type,foody_quest_task.id as foody_quest_task_id,foody_user_quest_completed.user_id as user_id from foody_quest inner join foody_quest_task on foody_quest.id=foody_quest_task.foody_quest_id inner join task on foody_quest_task.task_id=task.id inner join metric on task.metric_id=metric.id inner join foody_user_quest_completed on foody_quest.id=foody_user_quest_completed.foody_quest_id inner join users on foody_user_quest_completed.user_id=users.id left join foody_track_user_quest on foody_quest_task.id=foody_track_user_quest.foody_quest_task_id and foody_user_quest_completed.user_id = foody_track_user_quest.user_id where foody_quest.start_date<='${curDate}' and foody_quest.end_date >='${curDate}' and foody_quest.is_active=1 and metric.is_active=1 and metric.type='foody' and users.user_status='active' and foody_user_quest_completed.is_completed = 0`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    public getFoodyQuestTaskDetailsByQuestId = async (params) => {
        try {
            // tslint:disable-next-line: max-line-length
            const query = `SELECT foody_quest.id as foody_quest_id,ifnull(foody_track_user_quest.is_completed,0) as is_completed,foody_track_user_quest.id as foody_track_user_quest_id,ifnull(foody_track_user_quest.current_metric_count,0) as current_metric_count,foody_quest.start_date,task.goal,task.duration,metric.metric_type,foody_quest_task.id as foody_quest_task_id,foody_user_quest_completed.user_id as user_id from foody_quest inner join foody_quest_task on foody_quest.id=foody_quest_task.foody_quest_id inner join task on foody_quest_task.task_id=task.id inner join metric on task.metric_id=metric.id inner join foody_user_quest_completed on foody_quest.id=foody_user_quest_completed.foody_quest_id inner join users on foody_user_quest_completed.user_id=users.id left join foody_track_user_quest on foody_quest_task.id=foody_track_user_quest.foody_quest_task_id and foody_user_quest_completed.user_id = foody_track_user_quest.user_id where foody_quest.id=${params.quest_id} and metric.is_active=1 and metric.type='foody' and users.user_status='active' and foody_user_quest_completed.is_completed = 0`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    public updateTrackUserQuest = async (params) => {
        try {
            // tslint:disable-next-line: max-line-length
            const completedAt = params.is_completed === 1 ? `CURRENT_TIMESTAMP` : null;
            const query = `update foody_track_user_quest set current_metric_count=${params.current_metric_count},is_completed=${params.is_completed},completed_at=${completedAt},updated_at=CURRENT_TIMESTAMP where foody_quest_task_id=${params.foody_quest_task_id} and user_id=${params.user_id}`;
            const result = await this.sequelizeCon.query(query);
            // tslint:disable-next-line: no-string-literal
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public insertTrackUserQuest = async (params) => {
        try {
            // tslint:disable-next-line: max-line-length
            const completedAt = params.is_completed === 1 ? `CURRENT_TIMESTAMP` : null;
            const query = `INSERT into foody_track_user_quest (foody_quest_task_id,current_metric_count,user_id,is_completed,completed_at,created_at,updated_at) VALUES(${params.foody_quest_task_id},${params.current_metric_count},${params.user_id},${params.is_completed},${completedAt},CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`;
            const result = await this.sequelizeCon.query(query);
            // tslint:disable-next-line: no-string-literal
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public isAllFoodyTaskCompleted = async (params) => {
        try {
            // tslint:disable-next-line: max-line-length

            // tslint:disable-next-line: max-line-length
            const query = `SELECT count(foody_track_user_quest.id) as task_count,sum(foody_track_user_quest.is_completed) as completed_task_count from foody_quest INNER join foody_quest_task on foody_quest.id=foody_quest_task.foody_quest_id inner join foody_track_user_quest on  foody_track_user_quest.foody_quest_task_id=foody_quest_task.id where foody_quest.id=${params.foody_quest_id} and user_id='${params.user_id}'`;
            const result = await this.sequelizeCon.query(query);
            // tslint:disable-next-line: radix
            return result[0].length > 0 ? result[0][0].task_count === parseInt(result[0][0].completed_task_count) : false;
        } catch (error) {
            throw error;
        }
    }

    public markFoodyQuestComplete = async (params) => {
        try {
            const query = `update foody_user_quest_completed set is_completed=1,completed_at=CURRENT_TIMESTAMP where foody_quest_id=${params.foody_quest_id} and user_id=${params.user_id}`;
            const result = await this.sequelizeCon.query(query);
            return result[0].changedRows === 1;
        } catch (error) {
            throw error;
        }
    }

    public isQuestCompletedForFoody = async (params) => {
        try {
            const query = `select `;
            const result = await this.sequelizeCon.query(query);
            // tslint:disable-next-line: no-string-literal
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public addUserQuestReward = async (params) => {
        try {
            const query = `INSERT into foody_user_quest_reward (user_id,foody_quest_reward_id,is_seen,created_at,updated_at) VALUES(${params.user_id},${params.foody_quest_reward_id},0,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP) `;
            const result = await this.sequelizeCon.query(query);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public updateWallet = async (params) => {
        try {
            const query = `INSERT INTO wallet_transactions(user_id,txn_amount,txn_type,source,source_id,created_at,updated_at) VALUES(${params.user_id},${params.reward_monetary_val},'credit','foody_quest_reward',${params.foody_quest_reward_id},CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`;
            const result = await this.sequelizeCon.query(query);

            const updateUserQuery = `UPDATE users set wallet_amount = wallet_amount+${params.reward_monetary_val} where id=${params.user_id}`;
            const result1 = await this.sequelizeCon.query(updateUserQuery);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    public getFoodyRewardDetails = async (params) => {
        try {
            const query = `SELECT foody_quest_reward.id as foody_quest_reward_id,reward_lookup.name,reward.reward_monetary_val from foody_quest_reward inner join reward ON foody_quest_reward.reward_id=reward.id inner join reward_lookup on reward.reward_lookup_id=reward_lookup.id where foody_quest_reward.foody_quest_id=${params.foody_quest_id} `;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    public getAllUsersWhoseTaskGotCompleted = async () => {
        try {
            const curDate = DateHelper.getCurrentDateAsMysqlStr();
            // tslint:disable-next-line: max-line-length
            const query = `SELECT foody_quest.id as foody_quest_id,foody_quest_task.id as foody_quest_task_id,foody_user_quest_completed.user_id,count(foody_quest_task.id) as foody_quest_task_count,sum(foody_track_user_quest.is_completed) as completed_count from foody_quest inner join foody_quest_task on foody_quest.id = foody_quest_task.foody_quest_id inner join foody_user_quest_completed on foody_quest.id = foody_user_quest_completed.foody_quest_id inner join foody_track_user_quest on foody_track_user_quest.foody_quest_task_id = foody_quest_task.id and foody_user_quest_completed.user_id = foody_track_user_quest.user_id where foody_quest.start_date <= '${curDate}' and foody_quest.end_date >= '${curDate}' and foody_quest.is_active = 1 and foody_user_quest_completed.is_completed = 0 group by foody_user_quest_completed.user_id,foody_quest.id having foody_quest_task_count=completed_count`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    public getAllUsersWhoseTaskGotCompletedByQuestId = async (params) => {
        try {
            // tslint:disable-next-line: max-line-length
            const query = `SELECT foody_quest.id as foody_quest_id,foody_quest_task.id as foody_quest_task_id,foody_user_quest_completed.user_id,count(foody_quest_task.id) as foody_quest_task_count,sum(foody_track_user_quest.is_completed) as completed_count from foody_quest inner join foody_quest_task on foody_quest.id = foody_quest_task.foody_quest_id inner join foody_user_quest_completed on foody_quest.id = foody_user_quest_completed.foody_quest_id inner join foody_track_user_quest on foody_track_user_quest.foody_quest_task_id = foody_quest_task.id and foody_user_quest_completed.user_id = foody_track_user_quest.user_id where foody_quest.id = ${params.quest_id} and foody_user_quest_completed.is_completed = 0 group by foody_user_quest_completed.user_id,foody_quest.id having foody_quest_task_count=completed_count`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

}

export const foodyQuestModelIns = new FoodyQuestModel();
