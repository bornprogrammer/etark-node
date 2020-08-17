import RequestParamsCoordinator from "@app/coordinators/request-params-cordinators/RequestParamsCoordinator";
import { Request } from "express";


export class ServiceCenterRequestParamCoordinator extends RequestParamsCoordinator {

    /**
     *
     */
    constructor(request: Request) {
        super(request);
    }

    public static getInstance(request: Request): ServiceCenterRequestParamCoordinator {
        return new ServiceCenterRequestParamCoordinator(request);
    }

    public getOrderListParams = async () => {
        let params = this.setParamFromParamsAs("id", "sc_id").coordinate();
        return params;
    }

    public getAddServiceCenterOrderDetails = async () => {
        let params = this.setParamFromParamsAs("id", "sc_id").coordinate();
        return params;
    }
}