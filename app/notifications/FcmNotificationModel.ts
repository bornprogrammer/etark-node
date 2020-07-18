import { UserStatus } from '@app/app-const/UserStatus';
import { sequelize } from '@app/config/Sequelize';
import { Sequelize } from 'sequelize';

export class FcmNotificationModel {

    private sequelizeCon: Sequelize;
    constructor() {
        this.sequelizeCon = sequelize;
    }

    public getDeviceIdsByUserIds = async (userIds: number[]) => {
        try {
            const query = `SELECT user_sessions.device_token from user_sessions inner join users on users.id=user_sessions.user_id and users.user_status='active'
            and users.id in(${userIds.join()}) and user_sessions.device_token is not null and user_sessions.device_token!=''`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }

    public getDeviceIdsOfVerifiedBuddies = async () => {
        try {
            const query = `SELECT user_sessions.device_token from users inner join user_hub on users.id=user_hub.user_id
            inner join user_sessions on users.id=user_sessions.user_id
            where users.user_status='${UserStatus.USER_STATUS_ACTIVE}' and user_hub.type='both' and user_hub.status='verified' and user_sessions.device_token is not null and user_sessions.device_token!=''`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }
}

export const fcmNotificationModelIns = new FcmNotificationModel();
