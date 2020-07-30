
import RequestParamsCoordinator from "@app/coordinators/request-params-cordinators/RequestParamsCoordinator";
import { Request } from "express";

export class MasterRequestParamCoordinator extends RequestParamsCoordinator {

    /**
     *
     */
    constructor(request: Request) {
        super(request);
    }

    public static getInstance(request: Request): MasterRequestParamCoordinator {
        return new MasterRequestParamCoordinator(request);
    }

    public getMakerListByCategoryIdParams() {
        return this.setParamFromParams("id").coordinate();
    }

    public getMerchantListParams() {
        return this.setParamFromParams("type").coordinate();
    }



}