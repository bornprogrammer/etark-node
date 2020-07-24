import { userProfileUrlAppendTransformerIns } from '@app/collections/UserProfileUrlAppendTransformer';
import BaseController from '@app/controllers/BaseController';
import { ctrlMethodHandlerIns } from '@app/method-handler/CtrlMethodHandler';
import { Request, Response } from 'express';
import { fbConversationsControllerParamsBuilderIns } from '../FbConversationsControllerParamsBuilder';
import { FBConversationsEntityActionEnum } from '../FBConversationsEntityActionEnum';
import { FBConversationsEntityEnum } from '../FBConversationsEntityEnum';
import { expertiseTopicsListTransformerIns } from './ExpertiseTopicsListTransformer';
import { ExpertRepositoryService, expertRepositoryServiceIns } from './ExpertRepositoryService';
import { ctrlMethodParamsBuilderIns } from '@app/method-handler/CtrlMethodParamsBuilder';
import AppSessionService from '@app/services/AppSessionService';

export class ExpertController extends BaseController {

    constructor(expertRepositoryService: ExpertRepositoryService) {
        super(expertRepositoryService);
    }

    public getExpertsByTopic = async (req: Request, res: Response) => {
        const params = fbConversationsControllerParamsBuilderIns(req)
        .setExpertisePoint().setTopicIdFromUrl()
        .setEntityActionType(FBConversationsEntityActionEnum.CLAIM_EXPERTISE)
        .setEntityType(FBConversationsEntityEnum.TOPIC).build();
        params.user_id = AppSessionService.getUserId(req);
        ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.getExpertsByTopic)
        .setParams(params).setTransformer(userProfileUrlAppendTransformerIns).call(req, res);
    }

    public getListOfExpertiseTopics = async (req: Request, res: Response) => {
        const params = fbConversationsControllerParamsBuilderIns(req).setExpertisePoint().setEntityType(FBConversationsEntityEnum.TOPIC).setEntityActionType(FBConversationsEntityActionEnum.CLAIM_EXPERTISE).setParamsFromUrl('user_id', 'userId').build();
        ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.getListOfExpertiseTopics).setParams(params).setTransformer(expertiseTopicsListTransformerIns).call(req, res);
    }

    public markTopicExpertsSeen = async (req: Request, res: Response) => {
        const params = ctrlMethodParamsBuilderIns(req).setUserId().setParamsFromReqBody('expert_topic_seen').build();
        ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.markTopicExpertsSeen).setParams(params).call(req, res);
    }
}

export const expertControllerIns = new ExpertController(expertRepositoryServiceIns);
