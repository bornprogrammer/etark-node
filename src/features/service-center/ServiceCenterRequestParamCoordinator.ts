
import { Request } from "express";
import { paginationStrategyIns } from "@app/strategies/PaginationStrategy";
import RequestParamsValidatorCoordinator from "@app/coordinators/request-params-cordinators/RequestParamsValidatorCoordinator";
import Joi from "joi";
import { PhoneWarrantyTypeEnum } from "@app/enums/PhoneWarrantyTypeEnum";
import { ServiceCenterActivityTypeEnum } from "@app/enums/ServiceCenterActivityTypeEnum";

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

    public getAddServiceCenterOrderDetails = async () => {
        let params = await this.validateRequestBody(this.getAddServiceCenterOrderDetailsSchema());
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
            invoice_total_amount: Joi.number().when('phone_warranty', { is: PhoneWarrantyTypeEnum.IN_WARRANTY, then: Joi.number().equal(0) }).concat(Joi.number().required().min(1)),
            proforma_invoice_image: Joi.string().when('phone_warranty', { is: PhoneWarrantyTypeEnum.IN_WARRANTY, then: Joi.string().equal("") }).concat(Joi.string().required().min(3)),
            due_date: Joi.string().required(),
            device_delivery_date: Joi.string().required(),
            not_warranty_reason: Joi.optional(),
        })
        return schema;
    }

    public getSetActivityParams = async () => {
        let schema = await this.getSetActivityParamsSchema();
        let params = await this.setParamFromParams("pickup_delivery_id").setParamFromParams("activity_type").validateRequestContainer(schema);
        return params;
    }

    public getSetActivityParamsSchema = async () => {
        let schema = Joi.object({
            pickup_delivery_id: Joi.number().min(1),
            activity_type: Joi.any().valid(ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_ORDER_ACCEPTED, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_SERVICE_DENIED, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_SERVICE_DENIED_AFTER_INSPECTION, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_DECLINED_PAYMENT, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_INSPECTION_FEE_CLAIMED, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_READY_TO_DISPATCH, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_DISPATCHED, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_FAILURE, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_TO_CONFIRM, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_MADE_PAYMENT, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_DECLINED_PAYMENT, ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_INSPECTION_FEE_DENIED)
        });
        return schema;
    }

    public getAddDispatchDetailParams = async () => {
        let schema = await this.getAddDispatchDetailParamsSchema();
        let params = await this.setParamFromParams("pickup_delivery_id").validateRequestContainerNBody(schema);
        return params;
    }

    private getAddDispatchDetailParamsSchema = async () => {
        let schema = await Joi.object({
            pickup_delivery_id: Joi.number().min(1),
            device_front_image: Joi.string().min(3).required(),
            device_back_image: Joi.string().min(3).required(),
            final_invoice_image: Joi.optional(),
            final_invoice_amount: Joi.optional()
        })
        return schema;
    }

    public getLoginParams = async () => {
        let schema = await this.getLoginParamsSchema();
        let params = await this.validateRequestBody(schema);
        return params;
    }

    private getLoginParamsSchema = async () => {
        let schema = await Joi.object({
            email: Joi.string().min(3).email().required(),
            password: Joi.string().min(6).max(16).required(),
        })
        return schema;
    }

    public getOrderTrendsParams = async () => {
        let schema = await this.getOrderTrendsParamsSchema();
        let params = await this.setParamFromParamsAs("id", 'sc_id').validateRequestContainer(schema);
        return params;
    }

    private getOrderTrendsParamsSchema = async () => {
        let schema = await Joi.object({
            sc_id: Joi.number().min(1),
        })
        return schema;
    }

    public getDoesSCExistsParams = async () => {
        let schema = await this.getDoesSCExistsParamsSchema();
        let params = await this.setParamFromParams("city_id").setParamFromParams("maker_id").validateRequestContainer(schema);
        return params;
    }

    private getDoesSCExistsParamsSchema = async () => {
        let schema = await Joi.object({
            city_id: Joi.number().min(1),
            maker_id: Joi.number().min(1),
        })
        return schema;
    }
}