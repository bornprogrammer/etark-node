
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
        let params = this.setParamFromBody("complain_id").setParamFromBody("plan_id").setParamFromBody("is_pickup_delivery_choosed").coordinate();
        return params;
    }


}