import { Transformer } from '@app/collections/Transformer';
import { DateHelper } from '@app/modules/helper/DateHelper';
import { inputHelperIns } from '@app/modules/helper/InputHelper';
import { urlHelperIns } from '@app/modules/helper/UrlHelper';
import { questionAbusiveNIrrelevantTransformerIns } from './QuestionAbusiveNIrrelevantTransformer';
import { AppConst } from '@app/app-const/AppConst';

class QuestionsOfTopicYouAreExpertInListTransformer {

    private items: any;
    private changed: any;
    private loggedInUserId: any;
    constructor(items: any, loggedInUserId) {
        this.items = items;
        this.changed = {};
        this.loggedInUserId = loggedInUserId;
    }

    public transform() {
        if (inputHelperIns.isInputValid(this.items)) {

            this.changed.expertise_topic_count = this.items[0].topic_cnt;
            this.changed.questions = [];
            this.items.forEach((item) => {
                if (item.question_id) {
                    this.changed.questions.push(this.buildQuestionObj(item));
                }
            });
        }
        return this.changed;
    }

    private buildQuestionObj(item: any) {

        const obj = {
            // tslint:disable-next-line: max-line-length
            topic_name: item.topic_name, answer_count: item.answer_count, topic_id: item.topic_id, question: item.question, question_id: item.question_id, question_asked_at: DateHelper.getAgoFormat(item.created_at), name: item.name, questioned_by_profile: urlHelperIns.appendUserProfileUrl(item.profile), questioned_by: item.questioned_by, questioned_by_id: item.questioned_by_id, is_question_reported_abused: item.question_reported_abused_by_id !== null, question_abused_reported_user_id: item.question_abused_reported_user_id, question_irrelevant_marked_user_id: item.question_irrelevant_marked_user_id, is_question_marked_irrelevant: item.question_marked_irrelevant_by_id !== null,
        };
        obj[AppConst.SESSION_USER_ID] = this.loggedInUserId;
        questionAbusiveNIrrelevantTransformerIns.doTransform(obj);
        return obj;
    }
}
export const questionsOfTopicYouAreExpertInListTransformer = (item: any, loggedInUserId: any) => {
    return new QuestionsOfTopicYouAreExpertInListTransformer(item, loggedInUserId);
};
