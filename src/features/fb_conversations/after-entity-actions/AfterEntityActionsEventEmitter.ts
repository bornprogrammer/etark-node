import { BaseEventEmitter } from '../../../events-emitter/BaseEventEmitter';
import { AfterEntityCrudActionEnum } from '../AfterEntityCrudActionEnum';
import { FBConversationsEntityEnum } from '../FBConversationsEntityEnum';
import { FbConversationsEvents } from '../FbConversationsEvents';
import { afterAnswerActionDoneRepositoryServiceIns } from './AfterAnswerActionDoneRepositoryService';
import { afterCommentActionDoneRepositoryServiceIns } from './AfterCommentActionDoneRepositoryService';
import { afterQuestionActionDoneRepositoryServiceIns } from './AfterQuestionActionDoneRepositoryService';
import { afterTopicActionDoneRepositoryServiceIns } from './AfterTopicActionDoneRepositoryService';
import { IAfterEntityActionsEntity } from './IAfterEntityActionsEntity';

class AfterEntityActionsEventEmitter extends BaseEventEmitter {

    constructor() {
        super(FbConversationsEvents.afterEntityActions);
    }

    public async handle(iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) {

        switch (iAfterEntityActionsEntityParams.crud_action_type) {
            case AfterEntityCrudActionEnum.ENTITY_CRUD_ACTION_ADDED:
                this.afterEntityActionAdd(iAfterEntityActionsEntityParams);
                break;
            case AfterEntityCrudActionEnum.ENTITY_CRUD_ACTION_DELETED:
                this.afterEntityActionDelete(iAfterEntityActionsEntityParams);
                break;
            case AfterEntityCrudActionEnum.ENTITY_CRUD_ACTION_SEEN:
                this.afterEntityActionSeen(iAfterEntityActionsEntityParams);
                break;
        }
    }

    public afterEntityActionAdd = async (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {
        if (iAfterEntityActionsEntityParams.entity_type === FBConversationsEntityEnum.ANSWER) { // when any action happened on answer
            afterAnswerActionDoneRepositoryServiceIns.onAnswerActionAdded(iAfterEntityActionsEntityParams);
        }

        if (iAfterEntityActionsEntityParams.entity_type === FBConversationsEntityEnum.QUESTION) { // when any action happened on questions
            afterQuestionActionDoneRepositoryServiceIns.onQuestionActionAdded(iAfterEntityActionsEntityParams);
        }

        if (iAfterEntityActionsEntityParams.entity_type === FBConversationsEntityEnum.TOPIC) { // when any action happened on topic
            afterTopicActionDoneRepositoryServiceIns.onTopicActionAdded(iAfterEntityActionsEntityParams);
        }

        if (iAfterEntityActionsEntityParams.entity_type === FBConversationsEntityEnum.COMMENT) { // when any action happened on topic
            afterCommentActionDoneRepositoryServiceIns.onCommentActionAdded(iAfterEntityActionsEntityParams);
        }
    }

    public afterEntityActionSeen = async (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {
        if (iAfterEntityActionsEntityParams.entity_type === FBConversationsEntityEnum.ANSWER) { // when any action happened on answer
            afterAnswerActionDoneRepositoryServiceIns.onAnswerActionSeen(iAfterEntityActionsEntityParams);
        }

        if (iAfterEntityActionsEntityParams.entity_type === FBConversationsEntityEnum.QUESTION) { // when any action happened on questions
            afterQuestionActionDoneRepositoryServiceIns.onQuestionActionSeen(iAfterEntityActionsEntityParams);
        }
    }

    public afterEntityActionDelete = async (iAfterEntityActionsEntityParams: IAfterEntityActionsEntity) => {
        const params = null;
        if (iAfterEntityActionsEntityParams.entity_type === FBConversationsEntityEnum.ANSWER) { // when any action happened on answer
            afterAnswerActionDoneRepositoryServiceIns.onAnswerActionDeleted(iAfterEntityActionsEntityParams);
        }

        if (iAfterEntityActionsEntityParams.entity_type === FBConversationsEntityEnum.QUESTION) { // when any action happened on questions
            afterQuestionActionDoneRepositoryServiceIns.onQuestionActionDeleted(iAfterEntityActionsEntityParams);
        }

        if (iAfterEntityActionsEntityParams.entity_type === FBConversationsEntityEnum.TOPIC) { // when any action happened on topic
            afterTopicActionDoneRepositoryServiceIns.onTopicActionDeleted(iAfterEntityActionsEntityParams);
        }

        if (iAfterEntityActionsEntityParams.entity_type === FBConversationsEntityEnum.COMMENT) { // when any action happened on topic
            afterCommentActionDoneRepositoryServiceIns.onCommentActionDeleted(iAfterEntityActionsEntityParams);
        }
    }
}

export const afterEntityActionsEventEmitterIns = new AfterEntityActionsEventEmitter();
