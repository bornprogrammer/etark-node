// import { DateHelper } from '@app/modules/helper/DateHelper';
// import { inputHelperIns } from '@app/modules/helper/InputHelper';
// import { urlHelperIns } from '@app/modules/helper/UrlHelper';

// class QuestionWithMostVotedAnswersTransformer {

//     private items: any;
//     private changed: any;
//     private loggedInUserId: any;
//     // private profileUrl: any;
//     constructor(items: any, loggedInUserId: any) {
//         this.items = items;
//         this.changed = {};
//         this.loggedInUserId = loggedInUserId;
//     }
//     public transform() {

//         if (inputHelperIns.isInputValid(this.items)) {

//             this.items.forEach((item) => {
//                 if (item.question_id in this.changed === false) {
//                     // tslint:disable-next-line: max-line-length
//                     if (this.isQuestionToBeShown(item)) {
//                         const isQuestionModifiable = this.loggedInUserId === item.questioned_by_id;
//                         this.changed[item.question_id] = {
//                             // tslint:disable-next-line: max-line-length
//                             question_id: item.question_id, question: item.question, questioned_by: item.questioned_by, questioned_by_profile: urlHelperIns.appendUserProfileUrl(item.questioned_by_profile), question_asked_at: DateHelper.getAgoFormat(item.question_asked_at), is_question_modifiable: isQuestionModifiable, remaining_answer_count: 0, followed_by: item.followed_by === this.loggedInUserId, is_question_reported_abused: item.question_reported_abused_by_id !== null, question_marked_irrelevant_by_you: this.loggedInUserId === item.question_marked_irrelevant_by_id, is_question_marked_irrelevant: item.question_marked_irrelevant_by_id !== null, question_reported_abused_by_you: this.loggedInUserId === item.question_reported_abused_by_id,
//                         };
//                         Object.assign(this.changed[item.question_id], this.buildAnswerObj(item));
//                     }
//                 } else {
//                     this.changed[item.question_id].remaining_answer_count++;
//                     if (item.upvotes_count > this.changed[item.question_id].upvotes_count) {
//                         Object.assign(this.changed[item.question_id], this.buildAnswerObj(item));
//                     }
//                 }
//             });
//         }
//         return Object.values(this.changed);
//     }

//     private isQuestionToBeShown = (questionDetails: any): boolean => {
//         let isQuestionToBeShown = false;
//         // tslint:disable-next-line: max-line-length
//         if (questionDetails.is_question_enabled === 1 || (questionDetails.is_question_enabled === 0 && (this.loggedInUserId === questionDetails.question_reported_abused_by_id || this.loggedInUserId === questionDetails.question_marked_irrelevant_by_id)) || (questionDetails.is_question_enabled === 0 && this.loggedInUserId === questionDetails.questioned_by_id && (questionDetails.question_reported_abused_by_id !== null || questionDetails.question_marked_irrelevant_by_id !== null))) {
//             {
//                 isQuestionToBeShown = true;
//             }
//         }
//         return isQuestionToBeShown;
//     }

//     private buildAnswerObj = (item) => {
//         const isAnswerModifiable = this.loggedInUserId === item.answered_by_id;
//         // tslint:disable-next-line: max-line-length
//         const obj = { answered_by: item.answered_by, answered_by_profile: urlHelperIns.appendUserProfileUrl(item.answered_by_profile), answer_id: item.answer_id, answer: item.answer, answered_at: DateHelper.getAgoFormat(item.answered_at), upvotes_count: item.upvotes_count, is_answer_modifiable: isAnswerModifiable, is_upvoted_by_you: item.is_upvoted_by_you !== null, expertise_rank: item.expertise_rank };
//         return obj;
//     }
// }

// export const questionWithMostVotedAnswersTransformerIns = (items, loggedInUserId) => {
//     return new QuestionWithMostVotedAnswersTransformer(items, loggedInUserId);
// };
