import CustomError from '@app/errors/CustomError';
import ExpectationFailedError from '@app/errors/ExpectationFailedError';
import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import AppMiddlewareBootstrapper from '@app/middleware-bootstrapper/AppMiddlewareBootstrapper';
import BaseRepositoryService from '@app/services/BaseRepositoryService';
import { TopicRepository, topicRepositoryIns } from './TopicRepository';
import { chainingMethodHandlerIns } from '@app/method-handler/ChainingMethodHandler';
import { fbConversationRepositoryIns } from '../FBConversationRepository';
import { TopicMetadataTypeEnum } from './TopicMetadataTypeEnum';

export class TopicRepositoryService extends BaseRepositoryService {
    constructor(topicRepository: TopicRepository) {
        super(topicRepository);
    }

    public getPopularTopicType = async () => {
        return await repositoryServiceMethodHandlerIns
            .setMethodHandler(this.mRepository.getPopularTopicType).get();
    }

    public getTopicTypeLookUp = async () => {
        return await repositoryServiceMethodHandlerIns
            .setMethodHandler(this.mRepository.getTopicTypeLookUp).get();
    }

    public createUserTopic = async (data: any) => {
        return await repositoryServiceMethodHandlerIns
            .setMethodHandler(this.mRepository.createUserTopic)
            .setParams(data)
            .get();
    }

    public getTopic = async (data: any) => {
        return await repositoryServiceMethodHandlerIns
            .setMethodHandler(this.mRepository.getTopic).setParams(data).get();
    }

    public searchTopic = async (data: any) => {
        return await repositoryServiceMethodHandlerIns
            .setMethodHandler(this.mRepository.searchTopic).setParams(data).get();
    }

    public getTopicDetails = async (params: any) => {
        let result = await chainingMethodHandlerIns().setNextMethodHandlerNPreserveResult(fbConversationRepositoryIns.getEntityNActionID, params).setNextMethodHandlerNPreserveResult(this.mRepository.getTopicDetails).setNextMethodHandlerNPreserveResult(this.mRepository.getExpertImages).get();
        result = [result[1], result[2]];
        return result;
    }

    public getTopicDetailsByTopicId = async (params: any) => {
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getTopicDetailsByTopicId).setParams(params).get();
        return result;
    }

    public getUserTopicMetadata = async (data: any) => {
        const result = await repositoryServiceMethodHandlerIns
            .setMethodHandler(this.mRepository.getUserTopicMetadata).setParams(data).get();
        return result;
    }

    public getBookmarkedTopics = async (params: any) => {
        const result = await chainingMethodHandlerIns().setNextMethodHandlerNPreserveResult(fbConversationRepositoryIns.getEntityNActionID, params).setNextMethodHandlerNPreserveResult(this.mRepository.getTopicMetadataIdByType, [TopicMetadataTypeEnum.EXPERTS, TopicMetadataTypeEnum.QUESTIONS])
            .setNextMethodHandler(this.mRepository.getBookmarkedTopics).get();
        return result[2];
    }

    public getBookmarkedTopicsWithFilters = async (params: any) => {
        const result = await chainingMethodHandlerIns().setNextMethodHandlerNPreserveResult(fbConversationRepositoryIns.getEntityNActionID, params).setNextMethodHandlerNPreserveResult(this.mRepository.getTopicMetadataIdByType, [TopicMetadataTypeEnum.EXPERTS, TopicMetadataTypeEnum.QUESTIONS])
            .setNextMethodHandler(this.mRepository.getBookmarkedTopicsWithFilters).get();
        return result[2];
    }

    public getBookmarkedTopicsMonthWise = async (params: any) => {
        const result = await chainingMethodHandlerIns().setNextMethodHandlerNPreserveResult(fbConversationRepositoryIns.getEntityNActionID, params).setNextMethodHandlerNPreserveResult(this.mRepository.getTopicMetadataIdByType, [TopicMetadataTypeEnum.EXPERTS, TopicMetadataTypeEnum.QUESTIONS])
            .setNextMethodHandler(this.mRepository.getBookmarkedTopicsWithFilters).get();
        return result[2];
    }

    public getTopicCount = async (params: any) => {
        const topicCount = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getTopicCount).setParams(params).get();
        return topicCount;
    }
}

export const topicRepositoryServiceIns = new TopicRepositoryService(topicRepositoryIns);
