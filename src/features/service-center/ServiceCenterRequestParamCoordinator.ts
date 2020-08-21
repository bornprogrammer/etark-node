import RequestParamsCoordinator from "@app/coordinators/request-params-cordinators/RequestParamsCoordinator";
import { Request } from "express";
import { paginationStrategyIns } from "@app/strategies/PaginationStrategy";


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
        let params = await this.setParamFromParamsAs("id", "sc_id").setParamFromQueryStr("order_type").setParamFromQueryStr("order_no").coordinate();
        params = await paginationStrategyIns.extractOutPaginationParamsNMerge(this.request, params);
        return params;
    }

    public getAddServiceCenterOrderDetails = async () => {
        let params = this.setParamFromParamsAs("id", "sc_id").setParamFromBody("pickup_delivery_id").setParamFromBody("imei_number").setParamFromBody("device_front_image").setParamFromBody("device_back_image").setParamFromBody("phone_warranty").setParamFromBody("service_to_be_done").setParamFromBody("invoice_total_amount").setParamFromBody("invoice_image").setParamFromBody("due_date").coordinate();
        return params;
    }
}