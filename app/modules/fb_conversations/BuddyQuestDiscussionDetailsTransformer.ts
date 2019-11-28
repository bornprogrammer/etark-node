import { Transformer } from '@app/collections/Transformer';
import { DateHelper } from '../helper/DateHelper';
import { inputHelperIns } from '../helper/InputHelper';
import { urlHelperIns } from '../helper/UrlHelper';
import { AppConst } from '@app/app-const/AppConst';
import { questionAbusiveNIrrelevantTransformerIns } from './questions/QuestionAbusiveNIrrelevantTransformer';

class BuddyQuestDiscussionDetailsTransformer {

    private items: any;
    private changed: any;
    private loggedInUserId: number;
    constructor(items: any, loggedInUserId: number) {
        this.items = items;
        this.changed = {};
        this.loggedInUserId = loggedInUserId;
    }

    public transform() {

        if (inputHelperIns.isInputValid(this.items)) {

            const counts = this.items[0];
            this.changed = { all_topic_count: counts[0].counts, new_discussion_happening_count: counts[1].counts, unanswer_question_count: this.items[1].unanswer_question_count, questions: [] };

            if (inputHelperIns.isArrayValidNNotEmpty(this.items[2])) {
                this.items[2].forEach((item) => {
                    this.changed.questions.push(this.buildQuestionObj(item));
                });
            }
        }
        return this.changed;
    }

    private buildQuestionObj = (item) => {
        const obj = {
            // tslint:disable-next-line: max-line-length
            answer_count: item.answer_count, topic_name: item.topic_name, topic_id: item.topic_id, question: item.question, question_id: item.question_id, question_asked_at: DateHelper.getAgoFormat(item.created_at), questioned_by: item.name, questioned_by_profile: urlHelperIns.appendUserProfileUrl(item.profile),
            question_abused_reported_user_id: item.question_abused_reported_user_id, question_irrelevant_marked_user_id: item.question_irrelevant_marked_user_id,
        };
        obj[AppConst.SESSION_USER_ID] = this.loggedInUserId;
        questionAbusiveNIrrelevantTransformerIns.doTransform(obj);
        // question_reported_abused_by_you: (item.question_action_marked_user_id === this.loggedInUserId && item.question_action_type_id === 3),
        //     question_marked_irrelevant_by_you: (item.question_action_marked_user_id === this.loggedInUserId && item.question_action_type_id === 7)
        return obj;
    }
}
export const buddyQuestDiscussionDetailsTransformerIns = (item, loggedInUserId) => {
    return new BuddyQuestDiscussionDetailsTransformer(item, loggedInUserId);
};
