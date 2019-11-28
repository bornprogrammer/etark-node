export interface IMarkEntitySeenEntity {
    user_id: number | string;
    entity_type?: string;
    entity_action_type?: string;
    entity_type_id?: number;
    entity_action_type_id?: number;
    entity_origin_id: number | string;
    parent_entity_origin_id?: number;
}
