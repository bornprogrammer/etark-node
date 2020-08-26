
import { Request } from "express";
import { paginationStrategyIns } from "@app/strategies/PaginationStrategy";
import RequestParamsValidatorCoordinator from "@app/coordinators/request-params-cordinators/RequestParamsValidatorCoordinator";
import Joi from "joi";
import { PhoneWarrantyTypeEnum } from "@app/enums/PhoneWarrantyTypeEnum";

export class ServiceCenterRequestParamCoordinator extends RequestParamsValidatorCoordinator {

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

    public getAddServiceCenterOrderDetails = async (req: Request) => {
        let params = await this.validateRequestBody(this.getAddServiceCenterOrderDetailsSchema(), req);
        return params;
    }

    public getAddServiceCenterOrderDetailsSchema = () => {
        let schema = Joi.object({
            imei_number: Joi.string().required(),
            device_front_image: Joi.string().required(),
            pickup_delivery_id: Joi.number().required().min(1),
            device_back_image: Joi.string().required(),
            phone_warranty: Joi.any().valid(PhoneWarrantyTypeEnum.IN_WARRANTY, PhoneWarrantyTypeEnum.NON_WARRANTY, PhoneWarrantyTypeEnum.OUT_OF_WARRANTY),
            service_to_be_done: Joi.string().required(),
            invoice_total_amount: Joi.number().required().min(1),
            proforma_invoice_image: Joi.string().required(),
            final_invoice_image: Joi.string().required(),
            due_date: Joi.string().required(),
            device_delivery_date: Joi.string().required(),
        })
        return schema;
    }
}