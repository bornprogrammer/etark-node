import { AppConst } from '@app/app-const/AppConst';
import { Transformer } from '@app/collections/Transformer';
import { DateHelper } from '@app/modules/helper/DateHelper';
import { urlHelperIns } from '@app/modules/helper/UrlHelper';
import { answerAbusiveNIrrelevantTransformerIns } from './AnswerAbusiveNIrrelevantTransformer';

export class AnswerTransformerForAnswerList implements Transformer {

    public doTransform(item: any) {
        item.answered_by_profile = urlHelperIns.appendUserProfileUrl(item.answered_by_profile);
        item.answered_at = DateHelper.getAgoFormat(item.answered_at);
        item.is_answer_modifiable = item.answered_by_id === item[AppConst.SESSION_USER_ID];
        item.is_upvoted_by_you = item.is_upvoted_by_you === 1;
        answerAbusiveNIrrelevantTransformerIns.doTransform(item);
        return item;
    }
}

export const answerTransformerForAnswerListIns = new AnswerTransformerForAnswerList();
