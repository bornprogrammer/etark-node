
import RequestParamsCoordinator from "@app/coordinators/request-params-cordinators/RequestParamsCoordinator";

import { Request } from "express";

export class UserPlanRequestParamCoordinator extends RequestParamsCoordinator {

    /**
     *
     */
    constructor(req: Request) {
        super(req);
    }

    public static getInstance = (req: Request): UserPlanRequestParamCoordinator => {
        return new UserPlanRequestParamCoordinator(req);
    }

    public getAddUsePlanParams = () => {
        let params = this.setParamFromBody("complain_id").setParamFromBody("plan_id").coordinate();
        return params;
    }

    public getUpdateUsePlanParams = () => {
        let params = this.setParamFromBody("plan_id").setParamFromParamsAs('id', 'user_plan_id').coordinate();
        return params;
    }

    public getMakePaymentParams = () => {
        let params = this.setParamFromParams("user_plan_id").coordinate();
        return params;
    }


}