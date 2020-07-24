// import { AppConst } from '@app/app-const/AppConst';
// import { Transformer } from '@app/collections/Transformer';

// class AbusiveNIrrelevantTransformer implements Transformer {

//     public doTransform(item: any) {
//         item.question_reported_abused_by_you = (item.question_action_marked_user_id === item[AppConst.SESSION_USER_ID] && item.question_action_type_id === 3);
//         item.question_marked_irrelevant_by_you = (item.question_action_marked_user_id === item[AppConst.SESSION_USER_ID] && item.question_action_type_id === 7);
//     }
// }
// export const abusiveNIrrelevantTransformerIns = new AbusiveNIrrelevantTransformer();
