import { TokenNotSentError } from '@app/errors/TokenNotSentError';
import { repositoryMethodHandlerIns } from '@app/method-handler/RepositoryMethodHandler';
import BaseRepository from '@app/repositories/BaseRepository';
import { TopicModel, topicModelIns } from './TopicModel';
import { ChainingMethodParamsEntity } from '@app/method-handler/ChainingMethodParamsEntity';
import { inputHelperIns } from '@app/modules/helper/InputHelper';

export class TopicRepository extends BaseRepository {
    private topicModel: TopicModel;
    constructor(topicModel: TopicModel) {
        super();
        this.topicModel = topicModel;
    }

    public getPopularTopicType = async () => {
        const metadataResult = await repositoryMethodHandlerIns
            .setMethodHandler(this.topicModel.getPopularTopicType)
            .get();
        const community_experts = await repositoryMethodHandlerIns
            .setMethodHandler(this.topicModel.getCommunityExpertsCount)
            .get();
        return {
            community_experts_count: parseInt(community_experts[0].experts_count),
            metadata: metadataResult,
        };
    }

    public getTopic = async (data: any) => {
        return await repositoryMethodHandlerIns
            .setMethodHandler(this.topicModel.getTopic)
            .setParams(data)
            .get();
    }

    public searchTopic = async (data: any) => {
        return await repositoryMethodHandlerIns
            .setMethodHandler(this.topicModel.searchTopic)
            .setParams(data)
            .get();
    }

    public getTopicDetails = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const params = chainingMethodParamsEntity.getTopParams();
        Object.assign(params, chainingMethodParamsEntity.getPreservedResultsContainerByIndex(0));
        return await repositoryMethodHandlerIns
            .setMethodHandler(this.topicModel.getTopicDetails)
            .setParams(params)
            .get();
    }

    public getTopicDetailsByTopicId = async (params: any) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(this.topicModel.getTopicDetailsByTopicId).setParams(params).get();
        return result;
    }

    public getExpertImages = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const params = chainingMethodParamsEntity.getTopParams();
        return await repositoryMethodHandlerIns
            .setMethodHandler(this.topicModel.getExpertsProfile)
            .setParams(params)
            .get();
    }

    public getBookmarkedTopics = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const params = chainingMethodParamsEntity.getTopParams();
        Object.assign(params, chainingMethodParamsEntity.getPreservedResultsContainerByIndex(0));
        Object.assign(params, chainingMethodParamsEntity.getPreservedResultsContainerByIndex(1));
        const result = await repositoryMethodHandlerIns.setMethodHandler(this.topicModel.getBookmarkedTopics).setParams(params)
            .get();
        return result;
    }

    public getBookmarkedTopicsWithFilters = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const params = chainingMethodParamsEntity.getTopParams();
        Object.assign(params, chainingMethodParamsEntity.getPreservedResultsContainerByIndex(0));
        Object.assign(params, chainingMethodParamsEntity.getPreservedResultsContainerByIndex(1));
        const result = await repositoryMethodHandlerIns.setMethodHandler(this.topicModel.getBookmarkedTopicsWithFilters).setParams(params)
            .get();
        return result;
    }

    public getBookmarkedTopicsMonthWise = async (params: any) => {
        return await repositoryMethodHandlerIns
            .setMethodHandler(this.topicModel.getBookmarkedTopicsMonthWise)
            .setParams(params)
            .get();
    }

    public getTopicMetadataIdByType = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(this.topicModel.getTopicMetadataIdByType).setParams(chainingMethodParamsEntity.getMethodParams()).get();
        const topicMetadataIdByTypeObj = {};
        if (inputHelperIns.isArrayValidNNotEmpty(result)) {
            result.forEach((item) => {
                topicMetadataIdByTypeObj[item.fb_conversations_topic_metadata_name + '_id'] = item.id;
            });
        }
        return topicMetadataIdByTypeObj;
    }

    public getUserTopicMetadata = async (data: any) => {
        const topics = await repositoryMethodHandlerIns
            .setMethodHandler(this.topicModel.getUserBookmarkTopics)
            .setParams(data)
            .get();
        topics[0].entity = topics[0].total > 1 ? 'Bookmarks' : 'Bookmark';
        topics[0].action = topics[0].new_unseen > 1 ? 'New Discussions' : 'New Discussion';

        const questions = await repositoryMethodHandlerIns
            .setMethodHandler(this.topicModel.getUserBookmarkQuestion)
            .setParams(data)
            .get();
        questions[0].entity = questions[0].total > 1 ? 'Questions' : 'Question';
        questions[0].action = questions[0].new_unseen > 1 ? 'New Answers' : 'New Answer';

        const answers = await repositoryMethodHandlerIns
            .setMethodHandler(this.topicModel.getUserQuestionAnswers)
            .setParams(data)
            .get();
        answers[0].entity = answers[0].total > 1 ? 'Questions' : 'Question';
        answers[0].action = answers[0].new_unseen > 1 ? 'Upvotes' : 'Upvote';

        const arr = [topics, questions, answers];

        return [].concat.apply([], arr);
    }

    public getTopicTypeLookUp = async () => {
        const topicTypes = await repositoryMethodHandlerIns
            .setMethodHandler(this.topicModel.getTopicTypeLookUp)
            .get();
        return topicTypes;
    }

    public createUserTopic = async (data: any) => {
        const topicTypes = await repositoryMethodHandlerIns
            .setMethodHandler(this.topicModel.createUserTopic)
            .setParams(data)
            .get();
        return topicTypes;
    }

    public getTopicCount = async (params: any) => {
        const topicCount = await repositoryMethodHandlerIns.setMethodHandler(this.topicModel.getTopicCount).setParams(params).get();
        return topicCount;
    }
}

export const topicRepositoryIns = new TopicRepository(topicModelIns);
