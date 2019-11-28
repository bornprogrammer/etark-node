import { AppConst } from '@app/app-const/AppConst';
import { Transformer } from '@app/collections/Transformer';
import { DateHelper } from '@app/modules/helper/DateHelper';
import { urlHelperIns } from '@app/modules/helper/UrlHelper';
import { commentAbusiveNIrrelevantTransformerIns } from '../comments/CommentAbusiveNIrrelevantTransformer';

export class CommentTransformerForAnswerList implements Transformer {

    public doTransform(item: any) {
        item.commented_at = DateHelper.getAgoFormat(item.commented_at);
        item.commented_by_profile = urlHelperIns.appendUserProfileUrl(item.commented_by_profile);
        item.is_comment_modifiable = item[AppConst.SESSION_USER_ID] === item.commented_by_id;
        item.expertise_rank = item.commented_by_expertise_rank;
        commentAbusiveNIrrelevantTransformerIns.doTransform(item);
        return item;
    }
}
export const commentTransformerForAnswerListIns = new CommentTransformerForAnswerList();
