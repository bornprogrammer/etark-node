export interface IEntity {
    entity_type: string;
    entity_action_type: string;
    entity_type_id?: string;
    entity_action_type_id?: string;
    entity_origin_id: string | number;
}
