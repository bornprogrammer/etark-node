import { Transformer } from './Transformer';

export interface INestedTransformConfigurationEntity {
    primary_key_name: string; // will hold the primary key name such as question_id or answer_id
    keys?: string[];
    child_name?: string;
    transformer?: Transformer;
    selectAll?: boolean;
}
