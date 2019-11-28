import { AirthmeticOperatorEnum } from '@app/enums/AirthmeticOperatorEnum';

export interface IExpertPointUpdateEntity {
    fb_conversations_topic_id?: string | number;
    expert_id?: string | number;
    operator?: AirthmeticOperatorEnum;
    expertise_point?: number;
    is_seen?: number;
    is_expertise_claimed?: boolean;
}
