import RequestParamsCoordinator from "@app/coordinators/request-params-cordinators/RequestParamsCoordinator";
import RequestParamsValidatorCoordinator from "@app/coordinators/request-params-cordinators/RequestParamsValidatorCoordinator";
import { Request } from "express";
import Joi from "joi";



export class RetailerRequestParamCoordinator extends RequestParamsValidatorCoordinator {

    /**
    *
    */
    constructor(req: Request) {
        super(req);
    }


    public static getInstance = (req: Request): RetailerRequestParamCoordinator => {
        return new RetailerRequestParamCoordinator(req);
    }

    public getRetailerLoginParams = async () => {
        let schema = await this.getRetailerLoginSchema();
        let params = await this.validateRequestBody(schema);
        return params;
    }

    public getRetailerLoginSchema = async () => {
        return Joi.object({
            phone_number: Joi.string().length(10).required(),
            password: Joi.string().min(6).max(64).required()
        })
    }

    public getAddCustomerDetailsParams = async () => {
        let schema = await this.getAddCustomerDetailsParamsSchema();
        let params = await this.setParamFromParamsAs("id", "retailer_id").validateRequestContainerNBody(schema);
        return params;
    }

    private getAddCustomerDetailsParamsSchema = async () => {
        return Joi.object({
            customer_name: Joi.string().min(2).max(50).required(),
            email: Joi.string().min(3).max(50).email().required(),
            contact: Joi.string().length(10).required(),
            bill_id: Joi.string().alphanum().required(),
            maker_id: Joi.string().min(1).required(),
            retailer_id: Joi.string().min(1).required(),
        })
    }


}