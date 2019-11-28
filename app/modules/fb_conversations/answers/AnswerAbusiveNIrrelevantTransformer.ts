import { AppConst } from '@app/app-const/AppConst';
import { Transformer } from '@app/collections/Transformer';

class AnswerAbusiveNIrrelevantTransformer implements Transformer {

    public doTransform(item: any) {
        item.answer_reported_abused_by_you = item.answer_abused_reported_user_id === item[AppConst.SESSION_USER_ID];
        item.is_answer_reported_abused = item.answer_abused_reported_user_id !== null;
        item.answer_marked_irrelevant_by_you = item.answer_irrelevant_marked_user_id === item[AppConst.SESSION_USER_ID];
        item.is_answer_marked_irrelevant = item.answer_irrelevant_marked_user_id !== null;
    }
}
export const answerAbusiveNIrrelevantTransformerIns = new AnswerAbusiveNIrrelevantTransformer();
