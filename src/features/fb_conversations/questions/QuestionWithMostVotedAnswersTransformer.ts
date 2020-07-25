import { Transformer } from '@app/collections/Transformer';
import { DateHelper } from '@app/modules/helper/DateHelper';
import { urlHelperIns } from '@app/modules/helper/UrlHelper';
import { answerAbusiveNIrrelevantTransformerIns } from '../answers/AnswerAbusiveNIrrelevantTransformer';
import { questionAbusiveNIrrelevantTransformerIns } from './QuestionAbusiveNIrrelevantTransformer';

class QuestionWithMostVotedAnswersTransformer implements Transformer {

    public doTransform(item: any) {
        item.questioned_by_profile = urlHelperIns.appendUserProfileUrl(item.questioned_by_profile);
        item.question_asked_at = DateHelper.getAgoFormat(item.question_asked_at);
        item.is_question_modifiable = item.session_user_id === item.questioned_by_id;
        item.remaining_answer_count = 0;
        item.followed_by = item.followed_by === item.session_user_id;
        item.answered_by_profile = urlHelperIns.appendUserProfileUrl(item.answered_by_profile);
        item.answered_at = DateHelper.getAgoFormat(item.answered_at);
        item.is_answer_modifiable = item.answered_by_id === item.session_user_id;
        item.is_upvoted_by_you = item.is_upvoted_by_you !== null;
        item.remaining_answer_count = item.answer_cnt > 0 ? item.answer_cnt - 1 : 0;
        questionAbusiveNIrrelevantTransformerIns.doTransform(item);
        answerAbusiveNIrrelevantTransformerIns.doTransform(item);
    }
}

export const questionWithMostVotedAnswersTransformerIns = new QuestionWithMostVotedAnswersTransformer();
