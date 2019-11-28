// import BaseRepositoryService from '@app/services/BaseRepositoryService';
// import { FBConversationsEntityEnum } from '../FBConversationsEntityEnum';
// import { afterAnswerActionDoneRepositoryServiceIns } from './AfterAnswerActionDoneRepositoryService';
// import { AfterEntityActionsRepository, afterEntityActionsRepositoryIns } from './AfterEntityActionsRepository';
// import { afterQuestionActionDoneRepositoryServiceIns } from './AfterQuestionActionDoneRepositoryService';
// import { IAfterEntityActionsEntity } from './IAfterEntityActionsEntity';

// class AfterEntityActionsRepositoryServices extends BaseRepositoryService {

//     constructor(afterEntityActionsRepository: AfterEntityActionsRepository) {
//         super(afterEntityActionsRepository);
//     }

//     public afterEntityActionAdd = async (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {
//         if (iAfterEntityActionsEntityParams.entity_type === FBConversationsEntityEnum.ANSWER) { // when any action happened on answer
//             afterAnswerActionDoneRepositoryServiceIns.onAnswerActionAdded(iAfterEntityActionsEntityParams);
//         }

//         if (iAfterEntityActionsEntityParams.entity_type === FBConversationsEntityEnum.QUESTION) { // when any action happened on questions
//             afterQuestionActionDoneRepositoryServiceIns.onQuestionActionAdded(iAfterEntityActionsEntityParams);
//         }

//         if (iAfterEntityActionsEntityParams.entity_type === FBConversationsEntityEnum.TOPIC) { // when any action happened on topic
//             // this.onTopicActionAdded(iAfterEntityActionsEntityParams);
//         }
//     }

//     public afterEntityActionDelete = async (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {
//         const params = null;
//         if (iAfterEntityActionsEntityParams.entity_type === FBConversationsEntityEnum.ANSWER) { // when any action happened on answer
//             afterAnswerActionDoneRepositoryServiceIns.onAnswerActionDeleted(iAfterEntityActionsEntityParams);
//         }

//         if (iAfterEntityActionsEntityParams.entity_type === FBConversationsEntityEnum.QUESTION) { // when any action happened on questions
//             afterQuestionActionDoneRepositoryServiceIns.onQuestionActionDeleted(iAfterEntityActionsEntityParams);
//         }

//         if (iAfterEntityActionsEntityParams.entity_type === FBConversationsEntityEnum.TOPIC) { // when any action happened on topic
//             // this.onTopicActionAdded(iAfterEntityActionsEntityParams);
//         }
//     }
// }

// export const afterEntityActionsRepositoryServicesIns = new AfterEntityActionsRepositoryServices(afterEntityActionsRepositoryIns);
