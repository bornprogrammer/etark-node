import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import { expertRepositoryServiceIns } from '../experts/ExpertRepositoryService';
import { IExpertPointUpdateEntity } from '../experts/IExpertPointUpdateEntity';
import { FBConversationsEntityActionEnum } from '../FBConversationsEntityActionEnum';
import { IAfterEntityActionsEntity } from './IAfterEntityActionsEntity';

export class AfterTopicActionDoneRepositoryService {

    public onTopicActionAdded = (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {

        switch (iAfterEntityActionsEntityParams.entity_action_type) {
            case FBConversationsEntityActionEnum.CLAIM_EXPERTISE:
                this.onExpertiseClaimed(iAfterEntityActionsEntityParams);
                break;
            case FBConversationsEntityActionEnum.BOOKMARK:
                this.onTopicBookmarked(iAfterEntityActionsEntityParams.entity_origin_id);
                break;
        }
    }

    public onTopicActionDeleted = (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {

        switch (iAfterEntityActionsEntityParams.entity_action_type) {
            case FBConversationsEntityActionEnum.BOOKMARK:
                this.onTopicUnBookmarked(iAfterEntityActionsEntityParams.entity_origin_id);
                break;
        }
    }

    private onExpertiseClaimed = async (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {
        const iexpertPointUpdateEntityParams: IExpertPointUpdateEntity = { expert_id: iAfterEntityActionsEntityParams.user_id, fb_conversations_topic_id: iAfterEntityActionsEntityParams.entity_origin_id, expertise_point: 0, is_expertise_claimed: iAfterEntityActionsEntityParams.entity_action_type === FBConversationsEntityActionEnum.CLAIM_EXPERTISE };
        repositoryServiceMethodHandlerIns.setMethodHandler(expertRepositoryServiceIns.incrementExpertisePoint).setParams(iexpertPointUpdateEntityParams).get();
    }

    private onTopicBookmarked = async (questionId) => {

    }

    private onTopicUnBookmarked = async (questionId) => {

    }
}

export const afterTopicActionDoneRepositoryServiceIns = new AfterTopicActionDoneRepositoryService();
