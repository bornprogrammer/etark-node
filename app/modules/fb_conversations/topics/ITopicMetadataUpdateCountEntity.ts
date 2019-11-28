import { AirthmeticOperatorEnum } from "@app/enums/AirthmeticOperatorEnum";

export interface ITopicMetadataUpdateCountEntity {
    topicId: number | string;
    topicMetaDataType: string;
    count: number;
    operator?: AirthmeticOperatorEnum;
}
