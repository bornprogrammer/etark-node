import { PnsEventsName } from '@app/enums/PnsEventsName';
import { FBConversationsEntityEnum } from '../fb_conversations/FBConversationsEntityEnum';

export interface INotificationSubscribedUserByEventsParamsEntity {
    pns_event_name: PnsEventsName;
    entity_type: FBConversationsEntityEnum;
    entity_origin_id: string | number;
}
