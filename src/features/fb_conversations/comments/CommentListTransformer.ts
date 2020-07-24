import { AppConst } from '@app/app-const/AppConst';
import { Transformer } from '@app/collections/Transformer';
import { DateHelper } from '@app/modules/helper/DateHelper';
import { urlHelperIns } from '@app/modules/helper/UrlHelper';
import { commentAbusiveNIrrelevantTransformerIns } from './CommentAbusiveNIrrelevantTransformer';

export class CommentListTransformer implements Transformer {

    public doTransform(item: any) {
        item.commented_at = DateHelper.getAgoFormat(item.date);
        item.commented_by_profile = urlHelperIns.appendUserProfileUrl(item.profile);
        item.is_comment_modifiable = item[AppConst.SESSION_USER_ID] === item.commented_by_id;
        commentAbusiveNIrrelevantTransformerIns.doTransform(item);
    }
}
export const commentListTransformerIns = new CommentListTransformer();
