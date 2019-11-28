import { PnsEventsName } from '@app/enums/PnsEventsName';
import { BaseEventEmitter } from '@app/events-emitter/BaseEventEmitter';
import { inputHelperIns } from '@app/modules/helper/InputHelper';
import { fcmNotificationFacadeIns } from '@app/notifications/FcmNotificationFacade';
import { fcmPushNotificationPayloadBuilderIns } from '@app/notifications/FcmPushNotificationPayloadBuilder';
import { AfterEntityCrudActionEnum } from '../AfterEntityCrudActionEnum';
import { FbConversationsEvents } from '../FbConversationsEvents';

class AfterCommentEventEmitter extends BaseEventEmitter {

    constructor() {
        super(FbConversationsEvents.afterCommented);
    }

    public async handle(commentsParams: any) {
        if (inputHelperIns.isObjectValidNNotEmpty(commentsParams)) {
            switch (commentsParams.crud_action_type) {

                case AfterEntityCrudActionEnum.ENTITY_CRUD_ACTION_ADDED:
                    this.onCommentAdded(commentsParams);
                    break;
            }
        }
    }

    private onCommentAdded = async (commentsParams) => {
        const fcmPushNotificationPayloadBuilderParams = fcmPushNotificationPayloadBuilderIns().setPNSName(PnsEventsName.PNS_WHEN_COMMENTED_ON_ANSWER).setPayloadValWithCastValAsStr('question_id', commentsParams.question_id).setBodyTemplateValue({ user_name: commentsParams.user_name });
        fcmNotificationFacadeIns.sendByUserIds([commentsParams.answered_by], fcmPushNotificationPayloadBuilderParams);
    }
}

export const afterCommentEventEmitterIns = new AfterCommentEventEmitter();
