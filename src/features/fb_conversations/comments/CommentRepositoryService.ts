import { chainingMethodHandlerIns } from '@app/method-handler/ChainingMethodHandler';
import { ChainingMethodParamsEntity } from '@app/method-handler/ChainingMethodParamsEntity';
import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import BaseRepositoryService from '@app/services/BaseRepository';
import { AfterEntityCrudActionEnum } from '../AfterEntityCrudActionEnum';
import { fbConversationRepositoryIns } from '../FBConversationRepository';
import { FbConversationsEvents } from '../FbConversationsEvents';
import { IEntityStatusChangeParams } from '../IEntityStatusChangeParams';
import { afterCommentEventEmitterIns } from './AfterCommentEventEmitter';
import { CommentRepository, commentRepositoryIns } from './CommentRepository';
import { FBConversationsEntityEnum } from '../FBConversationsEntityEnum';

export class CommentRepositoryService extends BaseRepositoryService {
    constructor(commentRepository: CommentRepository) {
        super(commentRepository);
    }

    public addComment = async (params: any) => {
        const result = await chainingMethodHandlerIns().setNextMethodHandler(fbConversationRepositoryIns.getEntityTypeId, params).setNextMethodHandlerNPreserveResult(this.mRepository.addComment).setNextMethodHandler(this.afterCommented).get();
        return result[0];
    }

    public updateComment = async (params: any) => {
        return await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.updateComment).setParams(params).get();
    }

    public deleteComment = async (params: any) => {
        return await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.deleteComment).setParams(params).get();
    }

    public getCommentList = async (params: any) => {
        return await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getCommentList).setParams(params).get();
    }

    public enableComment = async (params: IEntityStatusChangeParams) => {
        params.status = 1;
        return await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.updateCommentStatus).setParams(params).get();
    }

    public disableComment = async (params: IEntityStatusChangeParams) => {
        params.status = 0;
        return await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.updateCommentStatus).setParams(params).get();
    }

    public getCommentDetails = async (params: any) => {
        return await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getCommentDetails).setParams(params).get();
    }

    public afterCommented = async (chainingMethodParamsEntityParams: ChainingMethodParamsEntity) => {
        const topParams = chainingMethodParamsEntityParams.getTopParams();
        if (topParams.entity_type === FBConversationsEntityEnum.ANSWER) {
            const params = { comment_id: chainingMethodParamsEntityParams.getResult() };
            const commentDetailsbyCommentId = await commentRepositoryServiceIns.getCommentDetails(params);
            if (commentDetailsbyCommentId) {
                commentDetailsbyCommentId.crud_action_type = AfterEntityCrudActionEnum.ENTITY_CRUD_ACTION_ADDED;
                afterCommentEventEmitterIns.emit(FbConversationsEvents.afterCommented, commentDetailsbyCommentId);
            }
        }
    }
}
export const commentRepositoryServiceIns = new CommentRepositoryService(commentRepositoryIns);
