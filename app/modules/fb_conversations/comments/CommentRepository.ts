import { ChainingMethodParamsEntity } from '@app/method-handler/ChainingMethodParamsEntity';
import { repositoryMethodHandlerIns } from '@app/method-handler/RepositoryMethodHandler';
import BaseRepository from '@app/repositories/BaseRepository';
import { IEntityStatusChangeParams } from '../IEntityStatusChangeParams';
import { commentModelIns } from './CommentModel';

export class CommentRepository extends BaseRepository {
    constructor() {
        super();
    }

    public addComment = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const topParams = chainingMethodParamsEntity.getTopParams();
        const params = chainingMethodParamsEntity.getResult();
        Object.assign(topParams, params);
        return await repositoryMethodHandlerIns.setMethodHandler(commentModelIns.addComment).setParams(topParams).get();
    }

    public updateComment = async (params: any) => {
        return await repositoryMethodHandlerIns.setMethodHandler(commentModelIns.updateComment).setParams(params).get();
    }

    public deleteComment = async (params: any) => {
        return await repositoryMethodHandlerIns.setMethodHandler(commentModelIns.deleteComment).setParams(params).get();
    }

    public getCommentList = async (params: any) => {
        return await repositoryMethodHandlerIns.setMethodHandler(commentModelIns.getCommentList).setParams(params).get();
    }

    public updateCommentStatus = async (params: IEntityStatusChangeParams) => {
        return await repositoryMethodHandlerIns.setMethodHandler(commentModelIns.updateCommentStatus).setParams(params).get();
    }

    public getCommentDetails = async (params: any) => {
        return await repositoryMethodHandlerIns.setMethodHandler(commentModelIns.getCommentDetails).setParams(params).get();
    }
}
export const commentRepositoryIns = new CommentRepository();
