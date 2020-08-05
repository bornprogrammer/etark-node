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
        return this.setParamFromBody("address").setParamFromBody("zip_code").setParamFromParamsAs("id", "user_id").coordinate();
    }


}

