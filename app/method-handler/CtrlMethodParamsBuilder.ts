import { FBConversationsEntityEnum } from '@app/modules/fb_conversations/FBConversationsEntityEnum';
import AppSessionService from '@app/services/AppSessionService';
import { Request } from 'express';

export class CtrlMethodParamsBuilder {
    protected params: any;
    protected request: Request;

    constructor(req: Request) {
        this.params = {};
        this.request = req;
    }

    public setUserId = () => {
        this.params.user_id = AppSessionService.getUserId(this.request);
        return this;
    }

    public setEntityType = (entityType: FBConversationsEntityEnum) => {
        this.params.entity_type = entityType;
        return this;
    }

    public setEntityOriginIdFromUrl = () => {
        // this.params.entity_origin_id = this.request.params.entityOriginId;
        return this.setParamsFromUrl('entity_origin_id', 'entityOriginId');

    }

    public setEntityOriginIdFromBody = () => {
        // this.params.entity_origin_id = this.request.body.entity_origin_id;
        return this.setParamsFromReqBody('entity_origin_id');
    }

    public setParams = (key: string, value: string) => {
        this.params[key] = value;
        return this;
    }

    public setParamsFromReqBody = (key: string) => {
        this.params[key] = this.request.body[key];
        return this;
    }

    public setParamsFromUrl = (key: string, urlKey: string) => {
        this.params[key] = this.request.params[urlKey];
        return this;
    }

    public setParamsFromReqQueryStr = (key: string) => {
        this.params[key] = this.request.query[key];
        return this;
    }

    public build = () => {
        return this.params;
    }

}

export const ctrlMethodParamsBuilderIns = (req: Request) => {
    return new CtrlMethodParamsBuilder(req);
};
