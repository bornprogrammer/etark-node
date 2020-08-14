import RequestParamsCoordinator from "@app/coordinators/request-params-cordinators/RequestParamsCoordinator";
import { Request } from "express";


export class UserRequestParamsCoordinator extends RequestParamsCoordinator {

    /**
     *
     */
    constructor(req: Request) {
        super(req);
    }

    public static getInstance = (req: Request) => {
        return new UserRequestParamsCoordinator(req);
    }

    public getAddAddressParams = () => {
        let params = this.setParamFromBody("address").setParamFromBody("zip_code").setParamFromParamsAs("id", "user_id").setParamFromBody("complain_id").setParamFromBody("city_id").setParamFromBody("lat").setParamFromBody("long").coordinate();
        params['city_id'] = params['city_id'] ? params['city_id'] : null;
        console.log('cit', params);
        return params;
    }

    public getSuccessPageDetailParams = () => {
        return this.setParamFromParamsAs("id", "user_id").setParamFromParams("order_id").coordinate();
    }




}

