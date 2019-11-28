import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import { commentRepositoryServiceIns } from '../comments/CommentRepositoryService';
import { fbConversationRepositoryServiceIns } from '../FBConversationRepositoryService';
import { FbConversationsConfiguration } from '../FbConversationsConfiguration';
import { FBConversationsEntityActionEnum } from '../FBConversationsEntityActionEnum';
import { FBConversationsEntityEnum } from '../FBConversationsEntityEnum';
import { IEntity } from '../IEntity';
import { IAfterEntityActionsEntity } from './IAfterEntityActionsEntity';

export class AfterCommentActionDoneRepositoryService {

    public onCommentActionAdded = (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {
        switch (iAfterEntityActionsEntityParams.entity_action_type) {
            case FBConversationsEntityActionEnum.IRRELEVANT:
                this.disableCommentIfIrrelevantCnt3(iAfterEntityActionsEntityParams);
                break;
            case FBConversationsEntityActionEnum.REPORT:
                this.disableComment(iAfterEntityActionsEntityParams);
                this.deleteMarkedIrrelevantAfterReportedAbusedBySameUser(iAfterEntityActionsEntityParams);
                break;
        }
    }

    public onCommentActionDeleted = (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {
        switch (iAfterEntityActionsEntityParams.entity_action_type) {
            case FBConversationsEntityActionEnum.IRRELEVANT:
                this.enableAnswerIfIrrelevantCnt2(iAfterEntityActionsEntityParams);
                break;
            case FBConversationsEntityActionEnum.REPORT:
                this.enableComment(iAfterEntityActionsEntityParams);
                break;
        }
    }

    private disableCommentIfIrrelevantCnt3 = async (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {
        const irrelevantCount = await this.getIrrelevantCountByCommentId(iAfterEntityActionsEntityParams.entity_origin_id);
        if (irrelevantCount === FbConversationsConfiguration.markedIrrelevantCount) {
            this.disableComment(iAfterEntityActionsEntityParams);
        }
    }

    private enableComment = (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {
        const params = { entity_id: iAfterEntityActionsEntityParams.entity_origin_id, entity_owner_id: iAfterEntityActionsEntityParams.user_id };
        commentRepositoryServiceIns.enableComment(params);
    }

    private disableComment = (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {
        const params = { entity_id: iAfterEntityActionsEntityParams.entity_origin_id, entity_owner_id: iAfterEntityActionsEntityParams.user_id };
        commentRepositoryServiceIns.disableComment(params);
    }

    private deleteMarkedIrrelevantAfterReportedAbusedBySameUser = (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {

    }

    private enableAnswerIfIrrelevantCnt2 = async (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {
        const irrelevantCount = await this.getIrrelevantCountByCommentId(iAfterEntityActionsEntityParams.entity_origin_id);
        if (irrelevantCount === (FbConversationsConfiguration.markedIrrelevantCount - 1)) {
            this.enableComment(iAfterEntityActionsEntityParams);
        }
    }

    private getIrrelevantCountByCommentId = async (commentId) => {
        const params: IEntity = { entity_origin_id: commentId, entity_type: FBConversationsEntityEnum.COMMENT, entity_action_type: FBConversationsEntityActionEnum.IRRELEVANT };
        const irrelevantCount = await repositoryServiceMethodHandlerIns.setMethodHandler(fbConversationRepositoryServiceIns.getEntityActionCountById).setParams(params).get();
        return irrelevantCount;
    }

}

export const afterCommentActionDoneRepositoryServiceIns = new AfterCommentActionDoneRepositoryService();
