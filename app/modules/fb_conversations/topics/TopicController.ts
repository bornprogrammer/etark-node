import { monthWiseCollectionTransformerIns } from '@app/collections/MonthWiseCollectionTransformer';
import { topicBannerImageUrlTransformerIns } from '@app/collections/TopicBannerImageUrlTransformer';
import BaseController from '@app/controllers/BaseController';
import { ctrlMethodHandlerIns } from '@app/method-handler/CtrlMethodHandler';
import { responseServiceIns } from '@app/response-handler/ResponseService';
import AppSessionService from '@app/services/AppSessionService';
import { Request, Response } from 'express';
import { FbConversationsConfiguration } from '../FbConversationsConfiguration';
import { fbConversationsControllerParamsBuilderIns } from '../FbConversationsControllerParamsBuilder';
import { bookmarkedTopicsListMonthWiseTransformerIns } from './BookmarkedTopicsListMonthWiseTransformer';
import { bookmarkedTopicsListTransformerIns } from './BookmarkedTopicsListTransformer';
import { topicDetailTransformerIns } from './TopicDetailTransformer';
import { topicListTransformerIns } from './TopicListTransformer';
import { TopicRepositoryService, topicRepositoryServiceIns } from './TopicRepositoryService';
import { topicServiceIns } from './TopicService';

class TopicController extends BaseController {

    constructor(topicRepositoryService: TopicRepositoryService) {
        super(topicRepositoryService);
    }

    public getPopularTopicTypes = async (req: Request, res: Response) => {
        await ctrlMethodHandlerIns
            .setMethodHandler(this.mRepositoryService.getPopularTopicType)
            .call(req, res);
    }

    public getTopicTypeLookUp = async (req: Request, res: Response) => {
        await ctrlMethodHandlerIns
            .setMethodHandler(this.mRepositoryService.getTopicTypeLookUp)
            .call(req, res);
    }

    public createUserTopic = async (req: Request, res: Response) => {
        const data = req.body;
        data.user_id = AppSessionService.getUserId(req);
        await ctrlMethodHandlerIns
            .setMethodHandler(this.mRepositoryService.createUserTopic)
            .setParams(data)
            .call(req, res);
    }

    public getTopic = async (req: Request, res: Response) => {
        const params = fbConversationsControllerParamsBuilderIns(req).setParamsFromUrl('topic_type_id', 'id').setParamsFromReqQueryStr('topic_name').build();
        await ctrlMethodHandlerIns
            .setMethodHandler(this.mRepositoryService.getTopic)
            .setParams(params)
            .setTransformer(topicListTransformerIns)
            .call(req, res);
    }

    public searchTopic = async (req: Request, res: Response) => {
        const data = req.query;
        data.user_id = AppSessionService.getUserId(req);
        await ctrlMethodHandlerIns
            .setMethodHandler(this.mRepositoryService.searchTopic)
            .setParams(data)
            .call(req, res);
    }

    public getBookmarkedTopics = async (req: Request, res: Response) => {
        const params = topicServiceIns.getBookmarkedTopicsParams(req);
        const resp = await ctrlMethodHandlerIns
            .setMethodHandler(this.mRepositoryService.getBookmarkedTopics)
            .setParams(params).get();
        const result = bookmarkedTopicsListTransformerIns(resp).transform();
        responseServiceIns.sendResponse(req, res, result);
    }

    public getBookmarkedTopicsWithFilters = async (req: Request, res: Response) => {
        const params: any = topicServiceIns.getBookmarkedTopicsParams(req);
        params.topic_type_id = req.params.topicTypeId;
        params.topic_name = req.params.topicNameStr;
        ctrlMethodHandlerIns
            .setMethodHandler(this.mRepositoryService.getBookmarkedTopicsWithFilters)
            .setParams(params).setTransformer(topicBannerImageUrlTransformerIns).call(req, res);
    }

    public getBookmarkedTopicsMonthWise = async (req: Request, res: Response) => {
        const params: any = topicServiceIns.getBookmarkedTopicsParams(req);
        params.topic_type_id = req.params.topicTypeId;
        const result = await ctrlMethodHandlerIns
            .setMethodHandler(this.mRepositoryService.getBookmarkedTopicsWithFilters)
            .setParams(params).get();
        const transformedResult = monthWiseCollectionTransformerIns(result, bookmarkedTopicsListMonthWiseTransformerIns()).transform();
        responseServiceIns.sendResponse(req, res, transformedResult);
    }

    public getTopicDetails = async (req: Request, res: Response) => {
        const params = topicServiceIns.getBookmarkedTopicsParams(req);
        params.topic_id = req.params.id;
        params.expertise_point = FbConversationsConfiguration.expertsCount;
        const result = await ctrlMethodHandlerIns
            .setMethodHandler(this.mRepositoryService.getTopicDetails)
            .setParams(params)
            .get();
        responseServiceIns.sendResponse(req, res, topicDetailTransformerIns(result).transform());
    }

    public getUserTopicMetadata = async (req: Request, res: Response) => {
        const data = { user_id: AppSessionService.getUserId(req) };
        await ctrlMethodHandlerIns
            .setMethodHandler(this.mRepositoryService.getUserTopicMetadata)
            .setParams(data)
            .call(req, res);
    }
}

export const topicControllerIns = new TopicController(topicRepositoryServiceIns);
