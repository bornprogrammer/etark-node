import { AppConst } from '@app/app-const/AppConst';
import { Transformer } from '@app/collections/Transformer';
// tslint:disable-next-line: ordered-imports
import { DateHelper } from '@app/modules/helper/DateHelper';
import { urlHelperIns } from '@app/modules/helper/UrlHelper';
import { questionAbusiveNIrrelevantTransformerIns } from '../questions/QuestionAbusiveNIrrelevantTransformer';

export class QuestionTransformerForAnswerList implements Transformer {

    public doTransform(item: any) {
        item.questioned_by_profile = urlHelperIns.appendUserProfileUrl(item.questioned_by_profile);
        item.question_asked_at = DateHelper.getAgoFormat(item.question_asked_at);
        item.is_question_modifiable = item[AppConst.SESSION_USER_ID] === item.questioned_by_id;
        item.remaining_answer_count = 0;
        item.followed_by = item.followed_by === item[AppConst.SESSION_USER_ID];
        item.is_answer_given_by_you = false;
        questionAbusiveNIrrelevantTransformerIns.doTransform(item);
        return item;
    }
}

export const questionTransformerForAnswerListIns = new QuestionTransformerForAnswerList();
