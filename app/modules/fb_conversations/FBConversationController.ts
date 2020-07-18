import BaseController from '@app/controllers/BaseController';
import { ctrlMethodHandlerIns } from '@app/method-handler/CtrlMethodHandler';
import { responseServiceIns } from '@app/response-handler/ResponseService';
import AppSessionService from '@app/services/AppSessionService';
import { Request, Response } from 'express';
import { buddyQuestDiscussionDetailsTransformerIns } from './BuddyQuestDiscussionDetailsTransformer';
import { FBConversationRepositoryService, fbConversationRepositoryServiceIns } from './FBConversationRepositoryService';
import { fbConversationsControllerParamsBuilderIns } from './FbConversationsControllerParamsBuilder';
import { fbConversationsQuestTaskListTransformerIns } from './FBConversationsQuestTaskListTransformer';

class FBConversationController extends BaseController {

    constructor(fbConversationRepositoryService: FBConversationRepositoryService) {
        super(fbConversationRepositoryService);
    }

    public entityActionAdd = async (req: Request, res: Response) => {
        const params = fbConversationsControllerParamsBuilderIns(req).setEntityType(req.body.entity_type).setEntityActionType(req.body.entity_action_type).setEntityOriginIdFromBody().build();
        ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.entityActionAdd).setParams(params).call(req, res);
    }

    public entityActionDelete = async (req: Request, res: Response) => {
        const params = fbConversationsControllerParamsBuilderIns(req).setEntityType(req.params.entityType).setEntityActionType(req.params.entityActionType).setEntityOriginIdFromUrl().build();
        ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.entityActionDelete).setParams(params).call(req, res);
    }

    public getQuestDiscussionTaskDetails = async (req: Request, res: Response) => {
        const params = fbConversationsControllerParamsBuilderIns(req).setCurDate().build();
        const result = await ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.getQuestDiscussionTaskDetails).setParams(params).get();
        responseServiceIns.sendResponse(req, res, fbConversationsQuestTaskListTransformerIns(result).transform());
    }

    public getBuddyQuestDiscussionDetails = async (req: Request, res: Response) => {
        const params = fbConversationsControllerParamsBuilderIns(req).setExpertisePoint().setCurDate().setPagination().build();
        const result = await ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.getBuddyQuestDiscussionDetails).setParams(params).get();
        responseServiceIns.sendResponse(req, res, buddyQuestDiscussionDetailsTransformerIns(result, AppSessionService.getUserId(req)).transform());
    }

    public getDiscussionNFrequentlyAskedQuestionsNAnswers = async (req: Request, res: Response) => {
        ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.getDiscussionNFrequentlyAskedQuestionsNAnswers).call(req, res);
    }


}

export const fbConversationControllerIns = new FBConversationController(fbConversationRepositoryServiceIns);
