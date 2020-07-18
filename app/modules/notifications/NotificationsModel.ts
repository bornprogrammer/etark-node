import { UserStatus } from '@app/app-const/UserStatus';
import { sequelize } from '@app/config/Sequelize';
import { Sequelize } from 'sequelize';
import { INotificationSubscribedUserByEventsParamsEntity } from './INotificationSubscribedUserByEventsParamsEntity';

class NotificationsModel {
    private sequelizeCon: Sequelize;
    constructor() {
        this.sequelizeCon = sequelize;
    }

    public subscribe = async (params: any) => {
        try {
            const notificationsEventsLookupIdNEntityTypeId = await this.getNotificationsEventsLookupIdNEntityTypeId(params);
            if (notificationsEventsLookupIdNEntityTypeId) {
                // tslint:disable-next-line: max-line-length
                const query = `INSERT into notification_subscriber (user_id,notifications_events_lookup_id,is_subscribed,fb_conversation_entity_type_lookup_id,entity_origin_id,created_at,updated_at) values(${params.user_id},${notificationsEventsLookupIdNEntityTypeId.notifications_events_lookup_id},1,${notificationsEventsLookupIdNEntityTypeId.entity_type_id},${params.entity_origin_id},CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`;
                const result = await this.sequelizeCon.query(query);
                return result;
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    public getNotificationsEventsLookupIdNEntityTypeId = async (params: any) => {
        try {
            const notificationsEventsLookupId = `SELECT id from notifications_events_lookup where notifications_events_name='${params.pns_event_name}'
            union all
            SELECT id from fb_conversations_entity_type_lookup where fb_conversation_enity_type='${params.entity_type}'`;
            let notificationsEventsLookupIdResult = await this.sequelizeCon.query(notificationsEventsLookupId);
            notificationsEventsLookupIdResult = notificationsEventsLookupIdResult[0].length === 2 ? notificationsEventsLookupIdResult[0] : null;
            if (notificationsEventsLookupIdResult) {
                notificationsEventsLookupIdResult = { notifications_events_lookup_id: notificationsEventsLookupIdResult[0].id, entity_type_id: notificationsEventsLookupIdResult[1].id };
                return notificationsEventsLookupIdResult;
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    public getNotificationSubscribedUserByEvents = async (params: INotificationSubscribedUserByEventsParamsEntity) => {
        try {
            const notificationsEventsLookupIdNEntityTypeId = await this.getNotificationsEventsLookupIdNEntityTypeId(params);
            if (notificationsEventsLookupIdNEntityTypeId) {
                // tslint:disable-next-line: max-line-length
                const subscribedUserQuery = `SELECT notification_subscriber.user_id from notification_subscriber inner join users on notification_subscriber.user_id=users.id where notification_subscriber.is_subscribed=1 and notifications_events_lookup_id=${notificationsEventsLookupIdNEntityTypeId.notifications_events_lookup_id} and users.user_status='${UserStatus.USER_STATUS_ACTIVE}' and notification_subscriber.entity_origin_id=${params.entity_origin_id} and notification_subscriber.fb_conversation_entity_type_lookup_id=${notificationsEventsLookupIdNEntityTypeId.entity_type_id}`;
                let subscribedUserResult = await this.sequelizeCon.query(subscribedUserQuery);
                subscribedUserResult = subscribedUserResult[0].length > 0 ? subscribedUserResult[0] : null;
                return subscribedUserResult;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    }

    public unSubscribe = async (params: any) => {
        try {
            const notificationsEventsLookupIdNEntityTypeId = await this.getNotificationsEventsLookupIdNEntityTypeId(params);
            if (notificationsEventsLookupIdNEntityTypeId) {
                // tslint:disable-next-line: max-line-length
                const query = `update notification_subscriber set is_subscribed=0,updated_at=CURRENT_TIMESTAMP where user_id=${params.user_id} and notifications_events_lookup_id=${notificationsEventsLookupIdNEntityTypeId.notifications_events_lookup_id} and is_subscribed=1 and fb_conversation_entity_type_lookup_id=${notificationsEventsLookupIdNEntityTypeId.entity_type_id} and entity_origin_id=${params.entity_origin_id}`;
                const result = await this.sequelizeCon.query(query);
                return result;
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    public getPhoneNoOfVerifiedBuddies = async () => {
        try {
            const query = `SELECT users.phone as user_phone from users inner join user_hub on users.id = user_hub.user_id where users.user_status ='active' and user_hub.type = 'both' and user_hub.status = 'verified' and users.phone is not NULL and users.phone!=''`;
            const result = await this.sequelizeCon.query(query);
            return result[0].length > 0 ? result[0] : null;
        } catch (error) {
            throw error;
        }
    }
}

export const notificationsModelIns = new NotificationsModel();
