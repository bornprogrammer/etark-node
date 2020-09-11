import { Request } from "express";
import RequestParamsValidatorCoordinator from "@app/coordinators/request-params-cordinators/RequestParamsValidatorCoordinator";
import Joi from "joi";

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

    public async getLoginParams(): Promise<any> {
        // let values =  this.setParamFromBody("mobile_number").setParamFromBody("password").coordinate();
        let schema = await this.getLoginParamsSchema();
        let values = await this.validateRequestBody(schema);
        return values;
    }

    private getLoginParamsSchema = async () => {
        let schema = Joi.object({
            mobile_number: Joi.string().length(10).required(),
            password: Joi.string().min(6).max(16).required()
        });
        return schema;
    }

    public async getCreateUserParams(): Promise<any> {
        let values = await this.validateRequestBody(this.getCreateUserParamsSchema());
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

    public async getForgotPasswordParams(): Promise<any> {
        let values = await this.validateRequestBody(this.getForgotPasswordParamsSchema());
        return values;
    }

    protected getForgotPasswordParamsSchema = () => {
        return Joi.object({
            email: Joi.string().min(3).email().required(),
        });
    }

    public async getResetPasswordParams(): Promise<any> {
        let values = await this.setParamFromParams("email").validateRequestContainerNBody(this.getResetPasswordParamsSchema());
        return values;
    }

    protected getResetPasswordParamsSchema = () => {
        return Joi.object({
            email: Joi.string().min(3).email().required(),
            password: Joi.string().min(6).max(16).required(),
            confirm_password: Joi.string().valid(Joi.ref('password')).required(),
        });
    }

    public async getAdminLoginParams(): Promise<any> {
        // let values =  this.setParamFromBody("mobile_number").setParamFromBody("password").coordinate();
        let schema = await this.getAdminLoginParamsSchema();
        let values = await this.validateRequestBody(schema);
        return values;
    }

    private getAdminLoginParamsSchema = async () => {
        let schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).max(16).required()
        });
        return schema;
    }
}