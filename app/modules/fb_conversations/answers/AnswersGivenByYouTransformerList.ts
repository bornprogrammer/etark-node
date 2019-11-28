import { Transformer } from '@app/collections/Transformer';
import { DateHelper } from '@app/modules/helper/DateHelper';
import { urlHelperIns } from '@app/modules/helper/UrlHelper';
import { questionAbusiveNIrrelevantTransformerIns } from '../questions/QuestionAbusiveNIrrelevantTransformer';
import { answerAbusiveNIrrelevantTransformerIns } from './AnswerAbusiveNIrrelevantTransformer';

class AnswersGivenByYouTransformerList implements Transformer {

    public doTransform(item: any) {
        return this.getAnswerGivenByYouObj(item);
    }

    private getAnswerGivenByYouObj = (item) => {
        // tslint:disable-next-line: max-line-length
        const topicObj = { topic_name: item.topic_name, question: item.question, question_id: item.question_id, answer: item.answer, topic_banner_image_url: urlHelperIns.appendTopicBannerImageUrl(item.topic_banner_image), answer_id: item.answer_id, answered_at: DateHelper.getAgoFormat(item.entity_created_at), answered_by_profile: urlHelperIns.appendUserProfileUrl(item.answered_by_profile), upvotes_count: item.upvotes_count, is_upvoted_by_you: item.upvoted_by !== null, question_asked_at: DateHelper.getAgoFormat(item.question_asked_at), questioned_by: item.questioned_by, questioned_by_profile: urlHelperIns.appendUserProfileUrl(item.questioned_by_profile), question_abused_reported_user_id: item.question_abused_reported_user_id, question_irrelevant_marked_user_id: item.question_irrelevant_marked_user_id, answer_irrelevant_marked_user_id: item.answer_irrelevant_marked_user_id, answer_abused_reported_user_id: item.answer_abused_reported_user_id };
        answerAbusiveNIrrelevantTransformerIns.doTransform(topicObj);
        questionAbusiveNIrrelevantTransformerIns.doTransform(topicObj);
        return topicObj;
    }
}

export const answersGivenByYouTransformerListIns = new AnswersGivenByYouTransformerList();
