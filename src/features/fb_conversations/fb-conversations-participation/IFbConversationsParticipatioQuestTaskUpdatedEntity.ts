import { AirthmeticOperatorEnum } from '@app/enums/AirthmeticOperatorEnum';
import { FBConversationsParticipationMetricTypeEnum } from './FBConversationsParticipationMetricTypeEnum';

export interface IFbConversationsParticipatioQuestTaskUpdatedEntity {
    operator: AirthmeticOperatorEnum;
    quest_task_type?: FBConversationsParticipationMetricTypeEnum;
    quest_task_id?: number;
    user_id: number | string;
    is_completed?: number;
}
