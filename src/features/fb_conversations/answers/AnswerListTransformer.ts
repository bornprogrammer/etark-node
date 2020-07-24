import { DateHelper } from '@app/modules/helper/DateHelper';
import { inputHelperIns } from '@app/modules/helper/InputHelper';
import { urlHelperIns } from '@app/modules/helper/UrlHelper';
import { answerAbusiveNIrrelevantTransformerIns } from './AnswerAbusiveNIrrelevantTransformer';
import { AppConst } from '@app/app-const/AppConst';
import { commentAbusiveNIrrelevantTransformerIns } from '../comments/CommentAbusiveNIrrelevantTransformer';
import { questionAbusiveNIrrelevantTransformerIns } from '../questions/QuestionAbusiveNIrrelevantTransformer';

class AnswerListTransformer {

    private items: any;
    private changed: any;
    private loggedInUserId: any;
    private topRow: any;
    private answerGivenByYou;
    constructor(items: any, loggedInUserId: any) {
        this.items = items;
        this.changed = {};
        this.loggedInUserId = loggedInUserId;
        this.answerGivenByYou = false;
    }
    public transform() {

        if (inputHelperIns.isInputValid(this.items)) {
            this.topRow = this.buildAnswerObj(this.items[0]);
            const item = this.items[0];
            const isQuestionModifiable = this.loggedInUserId === item.questioned_by_id;
            this.changed[item.question_id] = {
                // tslint:disable-next-line: max-line-length
                question_id: item.question_id, question: item.question, questioned_by: item.questioned_by, questioned_by_profile: urlHelperIns.appendUserProfileUrl(item.questioned_by_profile), question_asked_at: DateHelper.getAgoFormat(item.question_asked_at), is_question_modifiable: isQuestionModifiable, remaining_answer_count: 0, followed_by: item.followed_by === this.loggedInUserId, topic_name: item.topic_name, is_answer_given_by_you: false, question_abused_reported_user_id: item.question_abused_reported_user_id, question_irrelevant_marked_user_id: item.question_irrelevant_marked_user_id, topic_id: item.topic_id, answer_list: {},
            };

            if (item.question_id) {
                this.changed[item.question_id][AppConst.SESSION_USER_ID] = this.loggedInUserId;
                questionAbusiveNIrrelevantTransformerIns.doTransform(this.changed[item.question_id]);
            }

            if (this.items.length > 1 || (this.items[0].answer_id !== null)) {
                this.items.forEach((item: any) => {
                    if (item.answer_id in this.changed[item.question_id].answer_list === false && item.answer_id !== this.topRow.answer_id) {
                        this.changed[item.question_id].answer_list[item.answer_id] = this.buildAnswerObj(item);
                    }

                    if (item.comment_id !== null && item.answer_id === this.topRow.answer_id) { // adding comments to top answer
                        this.topRow.comment_count++;
                        this.topRow.comments.push(this.buildCommentObj(item));
                    }

                    if (item.comment_id !== null && item.answer_id !== this.topRow.answer_id) { // adding comments to asnwer list
                        this.changed[item.question_id].answer_list[item.answer_id].comment_count++;
                        this.changed[item.question_id].answer_list[item.answer_id].comments.push(this.buildCommentObj(item));
                    }
                });
                this.changed = this.changed[item.question_id];
                this.changed.answer_list = Object.values(this.changed.answer_list);
            } else {
                this.changed = this.changed[item.question_id];
                this.changed.answer_list = [];
            }
            // this.doSortResult();
            // this.mergeTopRow();
        }
        return this.changed;
    }

    private mergeTopRow = async () => {
        if (inputHelperIns.isObjectValidNNotEmpty(this.topRow)) {
            this.changed.answer_list.unshift(this.topRow);
            this.changed.is_answer_given_by_you = this.answerGivenByYou;
        }
    }

    private doSortResult = () => {
        if (inputHelperIns.isArrayValidNNotEmpty(this.changed.answer_list)) {
            const result: any = this.changed.answer_list.splice(0);
            result.sort(this.sortByAnswerId);
            this.changed.answer_list = [...this.changed.answer_list, ...result];
        }
    }

    private sortByAnswerId = (item1, item2) => {
        return item2.answer_id - item1.answer_id;
    }

    private isAnswerToBeShown = (answerDetails: any): boolean => {
        let isAnswerToBeShown = false;
        if (answerDetails.is_enabled === 1 || answerDetails.answer_reported_abused_by_id !== null || answerDetails.anwser_marked_irrelevant_by_id !== null) {
            {
                isAnswerToBeShown = true;
            }
        }
        return isAnswerToBeShown;
    }

    private buildAnswerObj = (item) => {
        let obj = {};
        if (item.answer_id !== null) {
            const isAnswerModifiable = this.loggedInUserId === item.answered_by_id;
            // tslint:disable-next-line: max-line-length
            obj = { answered_by: item.answered_by, answered_by_profile: urlHelperIns.appendUserProfileUrl(item.answered_by_profile), answer_id: item.answer_id, answer: item.answer, answered_at: DateHelper.getAgoFormat(item.answered_at), upvotes_count: item.upvotes_count, is_answer_modifiable: isAnswerModifiable, is_upvoted_by_you: item.is_upvoted_by_you === 1, expertise_rank: item.expertise_rank, comments: [], comment_count: 0, answer_abused_reported_user_id: item.answer_abused_reported_user_id, answer_irrelevant_marked_user_id: item.answer_irrelevant_marked_user_id };
            obj[AppConst.SESSION_USER_ID] = this.loggedInUserId;
            answerAbusiveNIrrelevantTransformerIns.doTransform(obj);
            if (this.loggedInUserId === item.answered_by_id && this.answerGivenByYou === false) {
                this.answerGivenByYou = true;
            }
        }
        return obj;
    }

    private buildCommentObj = (commentObj: any) => {
        const isCommentModifiable = this.loggedInUserId === commentObj.commented_by_id;
        // tslint:disable-next-line: max-line-length
        const obj = { commented_by: commentObj.commented_by, commented_by_profile: urlHelperIns.appendUserProfileUrl(commentObj.commented_by_profile), comment_id: commentObj.comment_id, comment: commentObj.comment, commented_at: DateHelper.getAgoFormat(commentObj.commented_at), is_comment_modifiable: isCommentModifiable, expertise_rank: commentObj.commented_by_expertise_rank, comment_abused_reported_user_id: commentObj.comment_abused_reported_user_id, comment_irrelevant_marked_user_id: commentObj.comment_irrelevant_marked_user_id, comment_count: commentObj.comment_count };
        obj[AppConst.SESSION_USER_ID] = this.loggedInUserId;
        commentAbusiveNIrrelevantTransformerIns.doTransform(obj);
        return obj;
    }
}

export const answerListTransformerIns = (items, loggedInUserId) => {
    return new AnswerListTransformer(items, loggedInUserId);
};
