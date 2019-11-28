import { AfterEntityCrudActionEnum } from '../AfterEntityCrudActionEnum';

export interface IAfterEntityActionsEntity {
    entity_type: string;
    entity_type_id?: any;
    entity_action_type?: string;
    entity_origin_id?: string | number;
    crud_action_type: AfterEntityCrudActionEnum; // will tell that entity action added or removed for any entity
    user_id?: number;
    entity_data?: any;
}
