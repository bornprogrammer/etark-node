import { AppConst } from '@app/app-const/AppConst';
import { Transformer } from '@app/collections/Transformer';

class QuestionAbusiveNIrrelevantTransformer implements Transformer {

    public doTransform(item: any) {
        item.question_reported_abused_by_you = item.question_abused_reported_user_id === item[AppConst.SESSION_USER_ID];
        item.is_question_reported_abused = item.question_abused_reported_user_id !== null;
        item.question_marked_irrelevant_by_you = item.question_irrelevant_marked_user_id === item[AppConst.SESSION_USER_ID];
        item.is_question_marked_irrelevant = item.question_irrelevant_marked_user_id !== null;
    }
}
export const questionAbusiveNIrrelevantTransformerIns = new QuestionAbusiveNIrrelevantTransformer();
