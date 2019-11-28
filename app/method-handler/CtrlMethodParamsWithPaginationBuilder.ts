import { AppConst } from '@app/app-const/AppConst';
import { Request } from 'express';
import { CtrlMethodParamsWithUserIdParamBuilder } from './CtrlMethodParamsWithUserIdParamBuilder';

export class CtrlMethodParamsWithPaginationBuilder extends CtrlMethodParamsWithUserIdParamBuilder {

    constructor(req: Request) {
        super(req);
    }

    public setPagination = () => {
        const pageNo = this.request.query.page_no;
        const offSet = (pageNo - 1) * AppConst.NO_OF_RECORD_PER_PAGE;
        this.params.offset = offSet;
        return this;
    }
}

export const ctrlMethodParamsWithPaginationBuilderIns = (req: Request) => {
    return new CtrlMethodParamsWithPaginationBuilder(req);
};
