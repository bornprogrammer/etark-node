import { AppConst } from '@app/app-const/AppConst';
import { Transformer } from '@app/collections/Transformer';

class CommentAbusiveNIrrelevantTransformer implements Transformer {

    public doTransform(item: any) {
        item.comment_reported_abused_by_you = item.comment_abused_reported_user_id === item[AppConst.SESSION_USER_ID];
        item.is_comment_reported_abused = item.comment_abused_reported_user_id !== null;
        item.comment_marked_irrelevant_by_you = item.comment_irrelevant_marked_user_id === item[AppConst.SESSION_USER_ID];
        item.is_comment_marked_irrelevant = item.comment_irrelevant_marked_user_id !== null;
    }
}
export const commentAbusiveNIrrelevantTransformerIns = new CommentAbusiveNIrrelevantTransformer();
