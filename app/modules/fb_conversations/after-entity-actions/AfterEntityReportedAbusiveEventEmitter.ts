// import { BaseEventEmitter } from '@app/events-emitter/BaseEventEmitter';
// import { FBConversationsEntityEnum } from '../FBConversationsEntityEnum';
// import { FbConversationsEvents } from '../FbConversationsEvents';
// import { IEntity } from '../IEntity';

// export class AfterEntityReportedAbusiveEventEmitter extends BaseEventEmitter {

//     constructor() {
//         super(FbConversationsEvents.afterAnswerReportedAbused);
//     }

//     public handle(iEntity: IEntity) {

//         switch (iEntity.entity_type) {
//             case FBConversationsEntityEnum.QUESTION:
//                 break;
//             case FBConversationsEntityEnum.ANSWER:
//                 break;
//         }
//     }
// }

// export const afterEntityReportedAbusiveEventEmitterIns = new AfterEntityReportedAbusiveEventEmitter();
