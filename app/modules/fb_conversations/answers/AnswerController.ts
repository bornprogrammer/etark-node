import { nestedCollectionTransformerIns } from '@app/collections/NestedCollectionTransformer';
import { nestedTransformConfigurationBuilderIns } from '@app/collections/NestedTransformConfigurationBuilder';
import BaseController from '@app/controllers/BaseController';
import { ctrlMethodHandlerIns } from '@app/method-handler/CtrlMethodHandler';
import { inputHelperIns } from '@app/modules/helper/InputHelper';
import { responseServiceIns } from '@app/response-handler/ResponseService';
import AppSessionService from '@app/services/AppSessionService';
import { Request, Response } from 'express';
import { fbConversationsControllerParamsBuilderIns } from '../FbConversationsControllerParamsBuilder';
import { FBConversationsEntityActionEnum } from '../FBConversationsEntityActionEnum';
import { FBConversationsEntityEnum } from '../FBConversationsEntityEnum';
import { answerListTransformerIns } from './AnswerListTransformer';
import { answerNQuestionByQuestionIdTransformerIns } from './AnswerNQuestionByQuestionIdTransformer';
import { AnswerRepositoryService, answerRepositoryServiceIns } from './AnswerRepositoryService';
import { answersGivenByYouTransformerListIns } from './AnswersGivenByYouTransformerList';
import { questionAbusiveNIrrelevantTransformerIns } from '../questions/QuestionAbusiveNIrrelevantTransformer';
import { questionTransformerForAnswerListIns } from './QuestionTransformerForAnswerList';
import { commentListTransformerIns } from '../comments/CommentListTransformer';
import { answerTransformerForAnswerListIns } from './AnswerTransformerForAnswerList';
import { commentTransformerForAnswerListIns } from './CommentTransformerForAnswerList';
import ArrayHelper from '@app/modules/helper/ArrayHelper';
import ObjectHelper from '@app/modules/helper/ObjectHelper';

class AnswerController extends BaseController {

    constructor(answerRepositoryService: AnswerRepositoryService) {
        super(answerRepositoryService);
    }

    public addAnswer = async (req: Request, res: Response) => {
        const params = fbConversationsControllerParamsBuilderIns(req).setQuestionIdFromUrl().setParamsFromReqBody('answer').build();
        await ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.addAnswer).setParams(params).call(req, res);
    }

    public updateAnswer = async (req: Request, res: Response) => {
        const params = fbConversationsControllerParamsBuilderIns(req).setQuestionIdFromUrl().setParamsFromReqBody('answer').setAnswerIdFromUrl().build();
        await ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.updateAnswer).setParams(params).call(req, res);
    }

    public deleteAnswer = async (req: Request, res: Response) => {
        const params = fbConversationsControllerParamsBuilderIns(req).setQuestionIdFromUrl().setAnswerIdFromUrl().build();
        await ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.deleteAnswer).setParams(params).call(req, res);
    }

    public getAnswerList = async (req: Request, res: Response) => {
        const params = fbConversationsControllerParamsBuilderIns(req).setQuestionIdFromUrl().setEntityType(FBConversationsEntityEnum.ANSWER).setEntityActionType(FBConversationsEntityActionEnum.UPVOTES).setExpertisePoint().build();

        // tslint:disable-next-line: max-line-lengths
        // tslint:disable-next-line: max-line-length
        const nestedTransConf = nestedTransformConfigurationBuilderIns().setPrimaryKeyName('question_id').setChildName('answer_list').setKeys(['question_id', 'questioned_by_id', 'question', 'questioned_by', 'questioned_by_profile', 'question_asked_at', 'followed_by', 'topic_name', 'is_answer_given_by_you', 'question_abused_reported_user_id', 'question_irrelevant_marked_user_id', 'topic_id']).setTransformer(questionTransformerForAnswerListIns).next().setPrimaryKeyName('answer_id').setChildName('comments').setKeys(['answered_by', 'answered_by_id', 'answered_by_profile', 'answer_id', 'answered_at', 'answer', 'upvotes_count', 'is_upvoted_by_you', 'expertise_rank', 'comment_count', 'answer_abused_reported_user_id', 'answer_irrelevant_marked_user_id']).setTransformer(answerTransformerForAnswerListIns).next().setPrimaryKeyName('comment_id').setKeys(['commented_by', 'comment_id', 'comment', 'commented_by_profile', 'commented_at', 'commented_by_expertise_rank', 'expertise_rank', 'comment_count', 'commented_by_id', 'comment_abused_reported_user_id', 'comment_irrelevant_marked_user_id']).setTransformer(commentTransformerForAnswerListIns).build();

        let result = await ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.getAnswerList).setParams(params).get();
        const userId = AppSessionService.getUserId(req);
        const nestedCollectionTransformerResp = nestedCollectionTransformerIns(result, userId).doTransform(nestedTransConf);

        if (inputHelperIns.isArrayValidNNotEmpty(nestedCollectionTransformerResp)) {
            result = nestedCollectionTransformerResp[0];
            result.is_answer_given_by_you = false;
            if (inputHelperIns.isArrayValidNNotEmpty(result.answer_list)) {
                result.answer_list.forEach((item) => {
                    item.comment_count = item.comments.length;
                    if (result.is_answer_given_by_you === false && userId === item.answered_by_id) {
                        result.is_answer_given_by_you = true;
                        return;
                    }
                });
            }
        }

        // const nestedCollectionTransformerResp = nestedCollectionTransformerIns(result, AppSessionService.getUserId(req)).doTransform(nestedTransConf);
        responseServiceIns.sendResponse(req, res, result);
    }

    public getAnswerNQuestionByQuestionId = async (req: Request, res: Response) => {
        const params = fbConversationsControllerParamsBuilderIns(req).setQuestionIdFromUrl().setAnswerIdFromUrl().setEntityType(FBConversationsEntityEnum.ANSWER).setEntityActionType(FBConversationsEntityActionEnum.UPVOTES).build();
        // tslint:disable-next-line: max-line-length
        const conf = nestedTransformConfigurationBuilderIns().setPrimaryKeyName('question_id').setChildName('answer_list').setSelectAll().setTransformer(answerNQuestionByQuestionIdTransformerIns).next().setPrimaryKeyName('answer_id').setKeys(['answered_by', 'answered_by_id', 'answered_by_profile', 'answer_id', 'answer', 'answered_at', 'upvotes_count', 'answer_reported_abused_by_id', 'answer_marked_irrelevant_by_id']).setTransformer(answerNQuestionByQuestionIdTransformerIns).build();
        const resp = await ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.getAnswerNQuestionByQuestionId).setParams(params).get();
        let nestedCollectionTransformerResp = nestedCollectionTransformerIns(resp, AppSessionService.getUserId(req)).doTransform(conf);
        nestedCollectionTransformerResp = inputHelperIns.isArrayValidNNotEmpty(nestedCollectionTransformerResp) ? nestedCollectionTransformerResp[0] : null;
        responseServiceIns.sendResponse(req, res, nestedCollectionTransformerResp);
    }

    public getAnswersGivenByYou = async (req: Request, res: Response) => {
        const params = fbConversationsControllerParamsBuilderIns(req).setEntityType(FBConversationsEntityEnum.ANSWER).setEntityActionType(FBConversationsEntityActionEnum.UPVOTES).build();
        const conf = nestedTransformConfigurationBuilderIns().setPrimaryKeyName('label').setChildName('collection').setKeys(['label']).next().setPrimaryKeyName('question_id').setTransformer(answersGivenByYouTransformerListIns).setSelectAll().build();
        ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.getAnswersGivenByYou).setParams(params).setNestedTransformer(conf).call(req, res);
    }
}

export const answerControllerIns = new AnswerController(answerRepositoryServiceIns);
