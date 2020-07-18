import { CtrlMethodParamsBuilder } from '@app/method-handler/CtrlMethodParamsBuilder';
import { CtrlMethodParamsWithPaginationBuilder } from '@app/method-handler/CtrlMethodParamsWithPaginationBuilder';
import { Request } from 'express';
import { DateHelper } from '../helper/DateHelper';
import { FbConversationsConfiguration } from './FbConversationsConfiguration';
import { FBConversationsEntityActionEnum } from './FBConversationsEntityActionEnum';
import { FBConversationsEntityEnum } from './FBConversationsEntityEnum';

class FbConversationsControllerParamsBuilder extends CtrlMethodParamsWithPaginationBuilder {

    constructor(req: Request) {
        super(req);
    }

    public setEntityActionType = (entityActionType: FBConversationsEntityActionEnum) => {
        this.params.entity_action_type = entityActionType;
        return this;
    }

    public setTopicIdFromBody = () => {
        // this.params.topic_id = this.request.body.topic_id;
        return this.setParamsFromReqBody('topic_id');
    }

    public setTopicIdFromUrl = () => {
        return this.setParamsFromUrl('topic_id', 'topicId');
    }

    public setQuestionIdFromBody = () => {
        // this.params.question_id = this.request.body.question_id;
        return this.setParamsFromReqBody('question_id');
    }

    public setQuestionIdFromUrl = () => {
        // this.params.question_id = this.request.params.questionId;
        return this.setParamsFromUrl('question_id', 'questionId');
    }

    public setAnswerIdFromBody = () => {
        // this.params.answer_id = this.request.body.answer_id;
        return this.setParamsFromReqBody('answer_id');
    }

    public setAnswerIdFromUrl = () => {
        // this.params.answer_id = this.request.params.answerId;
        return this.setParamsFromUrl('answer_id', 'answerId');
    }

    public setCommentIdFromBody = () => {
        // this.params.answer_id = this.request.body.answer_id;
        return this.setParamsFromReqBody('comment_id');
    }

    public setCommentIdFromUrl = () => {
        // this.params.answer_id = this.request.params.answerId;
        return this.setParamsFromUrl('comment_id', 'commentId');
    }

    public setExpertisePoint = () => {
        this.params.expertise_point = FbConversationsConfiguration.expertsCount;
        return this;
    }

    public setCurDate = () => {
        this.params.curdate = DateHelper.getCurrentUTCDateAsMysqlStr();
        return this;
    }
}

export const fbConversationsControllerParamsBuilderIns = (req: Request) => {
    return new FbConversationsControllerParamsBuilder(req);
};
