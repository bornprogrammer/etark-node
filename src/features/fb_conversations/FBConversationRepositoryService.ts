// tslint:disable-next-line: ordered-imports
import { AirthmeticOperatorEnum } from '@app/enums/AirthmeticOperatorEnum';
import { chainingMethodHandlerIns } from '@app/method-handler/ChainingMethodHandler';
import { ChainingMethodParamsEntity } from '@app/method-handler/ChainingMethodParamsEntity';
import { repositoryServiceMethodHandlerIns } from '@app/method-handler/RepositoryServiceMethodHandler';
import BaseRepositoryService from '@app/services/BaseRepository';
import { afterEntityActionsEventEmitterIns } from './after-entity-actions/AfterEntityActionsEventEmitter';
import { IAfterEntityActionsEntity } from './after-entity-actions/IAfterEntityActionsEntity';
import { IMarkEntitySeenEntity } from './after-entity-actions/IMarkEntitySeenEntity';
import { AfterEntityCrudActionEnum } from './AfterEntityCrudActionEnum';
import { FBConversationRepository, fbConversationRepositoryIns } from './FBConversationRepository';
import { FbConversationsEvents } from './FbConversationsEvents';
import { ITopicMetadataUpdateCountEntity } from './topics/ITopicMetadataUpdateCountEntity';
// tslint:disable-next-line: ordered-imports
import { questionRepositoryServiceIns } from './questions/QuestionRepositoryService';
import { IEntity } from './IEntity';

export class FBConversationRepositoryService extends BaseRepositoryService {

    constructor(fbConversationRepository: FBConversationRepository) {
        super(fbConversationRepository);
    }

    public entityActionAdd = async (params) => {
        const result = await chainingMethodHandlerIns()
            .setNextMethodHandlerNPreserveResult(this.mRepository.getEntityNActionID, params)
            .setNextMethodHandlerNPreserveResult(this.mRepository.entityActionAdd)
            .setNextMethodHandler(this.mRepository.incrementEntityActionCount)
            .setNextMethodHandler(this.afterEntityAction, AfterEntityCrudActionEnum.ENTITY_CRUD_ACTION_ADDED)
            .get();
        return result[1];
    }

    public entityActionDelete = async (params) => {
        const result = await chainingMethodHandlerIns().setNextMethodHandlerNPreserveResult(this.mRepository.getEntityNActionID, params).setNextMethodHandler(this.mRepository.entityActionDelete).setNextMethodHandler(this.mRepository.decrementEntityActionCount).setNextMethodHandler(this.afterEntityAction, AfterEntityCrudActionEnum.ENTITY_CRUD_ACTION_DELETED).get();
        return result[0];
    }

    public getQuestDiscussionTaskDetails = async (params) => {
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getQuestDiscussionTaskDetails).setParams(params).get();
        return result;
    }

    public getBuddyQuestDiscussionDetails = async (params) => {
        const result = await chainingMethodHandlerIns().setNextMethodHandlerNPreserveResult(this.mRepository.getTopicCountNExpertTopicRecentDiscussionCountsForBuddyDashboard, params).setNextMethodHandlerNMergeResult(this.getUnAnsweredQuestionCount, 'un_answered_question_count').setNextMethodHandler(this.mRepository.getBuddyQuestDiscussionDetails).get();
        return result;
    }

    public getUnAnsweredQuestionCount = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        let currentDiscussionCnt = chainingMethodParamsEntity.getPreservedResultsContainerByIndex(0);
        currentDiscussionCnt = currentDiscussionCnt[1].counts;
        if (currentDiscussionCnt === 0) {
            const unAnsweredQuestionCount = await repositoryServiceMethodHandlerIns.setMethodHandler(questionRepositoryServiceIns.getUnAnsweredQuestionCount).get();
            return unAnsweredQuestionCount;
        } else {
            return { unanswer_question_count: 0 };
        }
    }

    public getDiscussionNFrequentlyAskedQuestionsNAnswers = async () => {
        let result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getDiscussionNFrequentlyAskedQuestionsNAnswers).get();
        let imgUrl = 'https://foodybuddyrik.s3-ap-southeast-1.amazonaws.com/uploads/fb_conversation/';
        // tslint:disable-next-line: max-line-length
        const discussNEarnObj = [{
            header: 'Dish-tionary Lucky Draws',
            text: `Have a question about food ? Do you think you know a few tips and tricks about food that can help someone? Participate in the discussions about your favourite topics on food and stand a chance to win up to Rs 10,000. 10 Amazon gift cards worth Rs 5000 each to be given away.`,
            image_url: imgUrl + 'expert_lucky_draw.png',
        },
        {
            header: 'Expert Lucky Draw',
            text: `This will be a lucky draw of experts crossing 100 expertise points by answering questions. You get expertise points when your answers get upvoted by other users.So answer questions on your favourite topics and win prizes. We will be selecting upto 5 winners and each winner will get an Amazon gift card worth Rs 5000. Earn Expertise points and participate in the lucky draw!`,
            image_url: imgUrl + 'curious_lucky_draw.png',
        },
        {
            header: 'Curious Lucky Draw',
            text: `Have a question about food you need answers to? Look no further, ask our community of experts and get answers to your queries. Questions that receive more than 10 responses automatically qualify for a lucky draw. We will be selecting upto 5 winners and each winner will get an Amazon gift card worth Rs 5000. Hurry Post your question now!`,
        },
        {
            header: '',
            text: `All winning entries will be reviewed by the FoodyBuddy team to check for relevance with the topic and genuineness. Questions and Answers not related to the topic will automatically be disqualified.`,
        }];
        result = { fb_discussion: discussNEarnObj, frequently_asked_questions: result };
        return result;
    }

    // public getUserIdWhoBookmarkedTopicByQuestionId = async (questionId) => {
    //     const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.getUserIdWhoBookmarkedTopicByQuestionId).setParams(questionId).get();
    //     return result;
    // }

    public incrementTopicMetadataCount = async (params: ITopicMetadataUpdateCountEntity) => {
        params.operator = AirthmeticOperatorEnum.PLUS_OPERATOR;
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.updateTopicMetadataCount).setParams(params).get();
        return result;
    }

    public decrementTopicMetadataCount = async (params: ITopicMetadataUpdateCountEntity) => {
        params.operator = AirthmeticOperatorEnum.MINUS_OPERATOR;
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.updateTopicMetadataCount).setParams(params).get();
        return result;
    }

    public markEntitySeen = async (params: IMarkEntitySeenEntity) => {
        const result = await repositoryServiceMethodHandlerIns.setMethodHandler(this.mRepository.markEntitySeen).setParams(params).get();
        return result;
    }

    public getEntityActionCountById = async (params: IEntity) => {
        const result = await chainingMethodHandlerIns().setNextMethodHandler(fbConversationRepositoryIns.getEntityNActionID, params).setNextMethodHandler(this.mRepository.getEntityActionCountById).setParams(params).get();
        return result[0];
    }

    private afterEntityAction = async (chainingMethodParamsEntityParams: ChainingMethodParamsEntity) => {
        const topParams = chainingMethodParamsEntityParams.getTopParams();
        const params: IAfterEntityActionsEntity = { entity_type: topParams.entity_type, entity_action_type: topParams.entity_action_type, entity_origin_id: topParams.entity_origin_id, crud_action_type: chainingMethodParamsEntityParams.getMethodParams(), user_id: topParams.user_id };
        afterEntityActionsEventEmitterIns.emit(FbConversationsEvents.afterEntityActions, params);
    }
}

export const fbConversationRepositoryServiceIns = new FBConversationRepositoryService(fbConversationRepositoryIns);
