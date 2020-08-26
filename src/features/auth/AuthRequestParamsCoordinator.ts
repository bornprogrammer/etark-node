import { Request } from "express";
import RequestParamsCoordinator from "@app/coordinators/request-params-cordinators/RequestParamsCoordinator";
import RequestParamsValidatorCoordinator from "@app/coordinators/request-params-cordinators/RequestParamsValidatorCoordinator";
import Joi from "joi";
import { join } from "path";

export class AuthRequestParamsCoordinator extends RequestParamsValidatorCoordinator {
    /**
     *
     */
    protected constructor(request: Request) {
        super(request);
    }

    public static getInstance(request: Request): AuthRequestParamsCoordinator {
        return new AuthRequestParamsCoordinator(request);
    }

    public async getLoginParams(req: Request): Promise<any> {
        // let values =  this.setParamFromBody("mobile_number").setParamFromBody("password").coordinate();
        let schema = await this.getLoginParamsSchema();
        let values = await this.validateRequestBody(schema, req);
        return values;
    }

    private getLoginParamsSchema = async () => {
        let schema = Joi.object({
            mobile_number: Joi.string().length(10).required(),
            password: Joi.string().min(6).max(16).required()
        });
        return schema;
    }

    public async getCreateUserParams(req: Request): Promise<any> {
        let values = await this.validateRequestBody(this.getCreateUserParamsSchema(), req);
        return values;
    }

    public getCreateUserParamsSchema = () => {
        return Joi.object({
            mobile_number: Joi.string().length(10).required(),
            password: Joi.string().min(6).max(16).required(),
            name: Joi.string().min(2).required(),
            email: Joi.string().min(3).email().required(),
        });
    }
}