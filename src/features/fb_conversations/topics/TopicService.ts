import AppSessionService from '@app/services/AppSessionService';
import { Request } from 'express';
import { FBConversationsEntityActionEnum } from '../FBConversationsEntityActionEnum';
import { FBConversationsEntityEnum } from '../FBConversationsEntityEnum';
import { fbConversationsControllerParamsBuilderIns } from '../FbConversationsControllerParamsBuilder';

class TopicService {

    public getBookmarkedTopicsParams = (req: Request): any => {
        // const params = { user_id: AppSessionService.getUserId(req), entity_type: FBConversationsEntityEnum.TOPIC, entity_action_type: FBConversationsEntityActionEnum.BOOKMARK };
        const params = fbConversationsControllerParamsBuilderIns(req).setEntityType(FBConversationsEntityEnum.TOPIC).setEntityActionType(FBConversationsEntityActionEnum.BOOKMARK).build();
        return params;
    }
}

export const topicServiceIns = new TopicService();
