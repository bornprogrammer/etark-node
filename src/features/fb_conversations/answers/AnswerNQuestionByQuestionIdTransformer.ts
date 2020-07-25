import { Transformer } from '@app/collections/Transformer';
import { DateHelper } from '@app/modules/helper/DateHelper';
import { urlHelperIns } from '@app/modules/helper/UrlHelper';

class AnswerNQuestionByQuestionIdTransformer implements Transformer {

    public doTransform(item: any) {
        item.question_asked_at = DateHelper.getAgoFormat(item.question_asked_at);
        item.answered_at = DateHelper.getAgoFormat(item.answered_at);
        item.is_upvoted_by_you = item.is_upvoted_by_you === 1;
        item.questioned_by_profile = urlHelperIns.appendUserProfileUrl(item.questioned_by_profile);
        item.answered_by_profile = urlHelperIns.appendUserProfileUrl(item.answered_by_profile);
        return item;
    }
}

export const answerNQuestionByQuestionIdTransformerIns = new AnswerNQuestionByQuestionIdTransformer();
