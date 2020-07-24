import BaseController from '@app/controllers/BaseController';
import { ctrlMethodHandlerIns } from '@app/method-handler/CtrlMethodHandler';
import { Request, Response } from 'express';
import { fbConversationsControllerParamsBuilderIns } from '../FbConversationsControllerParamsBuilder';
import { CommentRepositoryService, commentRepositoryServiceIns } from './CommentRepositoryService';
import { commentListTransformerIns } from './CommentListTransformer';

class CommentController extends BaseController {

    constructor(commentRepositoryService: CommentRepositoryService) {
        super(commentRepositoryService);
    }

    public addComment = async (req: Request, res: Response) => {
        const params = fbConversationsControllerParamsBuilderIns(req).setEntityOriginIdFromBody().setEntityType(req.body.entity_type).setParamsFromReqBody('comment').build();
        ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.addComment).setParams(params).call(req, res);
    }

    public updateComment = async (req: Request, res: Response) => {
        const params = fbConversationsControllerParamsBuilderIns(req).setCommentIdFromUrl().setParamsFromReqBody('comment').build();
        ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.updateComment).setParams(params).call(req, res);
    }

    public getCommentList = async (req: Request, res: Response) => {
        const params = fbConversationsControllerParamsBuilderIns(req).setTopicIdFromUrl().setExpertisePoint().setCommentIdFromUrl().build();
        ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.getCommentList).setParams(params).setTransformer(commentListTransformerIns).call(req, res);
    }

    public deleteComment = async (req: Request, res: Response) => {
        const params = fbConversationsControllerParamsBuilderIns(req).setAnswerIdFromUrl().setCommentIdFromUrl().build();
        ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.deleteComment).setParams(params).call(req, res);
    }
}

export const commentControllerIns = new CommentController(commentRepositoryServiceIns);
