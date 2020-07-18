import { Request } from 'express';
import { CtrlMethodParamsBuilder } from './CtrlMethodParamsBuilder';

export class CtrlMethodParamsWithUserIdParamBuilder extends CtrlMethodParamsBuilder {

    constructor(req: Request) {
        super(req);
        this.setUserId();
    }
}

export const ctrlMethodParamsWithUserIdParamBuilderIns = (req: Request) => {
    return new CtrlMethodParamsWithUserIdParamBuilder(req);
};
