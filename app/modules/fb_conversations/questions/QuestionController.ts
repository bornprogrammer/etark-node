import { monthWiseCollectionTransformerIns } from '@app/collections/MonthWiseCollectionTransformer';
import BaseController from '@app/controllers/BaseController';
import { ctrlMethodHandlerIns } from '@app/method-handler/CtrlMethodHandler';
import { responseServiceIns } from '@app/response-handler/ResponseService';
import AppSessionService from '@app/services/AppSessionService';
import { Request, Response } from 'express';
import { fbConversationsControllerParamsBuilderIns } from '../FbConversationsControllerParamsBuilder';
import { FBConversationsEntityActionEnum } from '../FBConversationsEntityActionEnum';
import { FBConversationsEntityEnum } from '../FBConversationsEntityEnum';
import { followedQuestionListMonthWiseTransformerIns } from './FollowedQuestionListMonthWiseTransformer';
import { QuestionRepositoryService, questionRepositoryServiceIns } from './QuestionRepositoryService';
import { questionsOfTopicYouAreExpertInListTransformer } from './QuestionsOfTopicYouAreExpertInListTransformer';
import { questionWithMostVotedAnswersTransformerIns } from './QuestionWithMostVotedAnswersTransformer';

class QuestionController extends BaseController {

    constructor(questionRepositoryService: QuestionRepositoryService) {
        super(questionRepositoryService);
    }

    public addQuestion = async (req: Request, res: Response) => {
        const params = fbConversationsControllerParamsBuilderIns(req).setTopicIdFromUrl().setParamsFromReqBody('question').build();
        await ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.addQuestion).setParams(params).call(req, res);
    }

    public updateQuestion = async (req: Request, res: Response) => {
        const params = fbConversationsControllerParamsBuilderIns(req).setTopicIdFromUrl().setParamsFromReqBody('question').setQuestionIdFromUrl().build();
        await ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.updateQuestion).setParams(params).call(req, res);
    }

    public deleteQuestion = async (req: Request, res: Response) => {
        const params = fbConversationsControllerParamsBuilderIns(req).setTopicIdFromUrl().setQuestionIdFromUrl().build();
        await ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.deleteQuestion).setParams(params).call(req, res);
    }

    public getQuestionFillers = async (req: Request, res: Response) => {
        // this.mRepositoryService.getMostResponsedQuestion();
        await ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.getMostResponsedQuestion).call(req, res);
    }

    public getQuestionWithMostVotedAnswers = async (req: Request, res: Response) => {
        const params = fbConversationsControllerParamsBuilderIns(req).setTopicIdFromUrl().setEntityType(FBConversationsEntityEnum.ANSWER).setExpertisePoint().setEntityActionType(FBConversationsEntityActionEnum.UPVOTES).build();
        ctrlMethodHandlerIns
            .setMethodHandler(this.mRepositoryService.getQuestionWithMostVotedAnswers)
            .setParams(params).setTransformer(questionWithMostVotedAnswersTransformerIns).call(req, res);
    }

    public getQuestionList = async (req: Request, res: Response) => {
        const params = { topic_ids: req.params.id };
        await ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.getQuestionList).setParams(params).call(req, res);
    }

    public getQuestionsFollowedByYou = async (req: Request, res: Response) => {

        const params = fbConversationsControllerParamsBuilderIns(req)
            .setEntityType(FBConversationsEntityEnum.QUESTION)
            .setEntityActionType(FBConversationsEntityActionEnum.FOLLOWING)
            .setParamsFromUrl('question_str', 'questionStr').build();

        const result = await ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.getQuestionsFollowedByYou).setParams(params).get();
        responseServiceIns.sendResponse(req, res, monthWiseCollectionTransformerIns(result, followedQuestionListMonthWiseTransformerIns()).transform());
    }

    public getQuestionsOfTopicYouAreExpertIn = async (req: Request, res: Response) => {
        const params = fbConversationsControllerParamsBuilderIns(req).setExpertisePoint().build();
        const result = await ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.getQuestionsOfTopicYouAreExpertIn).setParams(params).get();
        responseServiceIns.sendResponse(req, res, questionsOfTopicYouAreExpertInListTransformer(result, AppSessionService.getUserId(req)).transform());
    }

    public askQuestion = async (req: Request, res: Response) => {
        const params = req.body;
        params.user_id = AppSessionService.getUserId(req);
        ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.askQuestion)
            .setParams(params)
            .call(req, res);
    }
}

export const questionControllerIns = new QuestionController(questionRepositoryServiceIns);
