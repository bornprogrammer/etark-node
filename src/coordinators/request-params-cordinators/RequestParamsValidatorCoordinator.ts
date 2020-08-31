import RequestParamsCoordinator from "./RequestParamsCoordinator";
import { Request } from "express";
import BadHttpRequestError from "@app/errors/BadHttpRequestError";
import { object } from "joi";


export default abstract class RequestParamsValidatorCoordinator extends RequestParamsCoordinator {

    public validate = async (schema: any, requestParams: any) => {
        try {
            let values = await schema.validate(requestParams);
            if (values.error) {
                throw values.error;
            }
            return values.value;
        } catch (error) {
            throw new BadHttpRequestError(error.details[0].message);
        }
    }

    public validateRequestBody = async (schema: any) => {
        let result = await this.validate(schema, this.request.body);
        return result;
    }

    public validateRequestContainer = async (schema: any) => {
        let result = await this.validate(schema, this.reqParamsContainer);
        return result;
    }

    public validateRequestContainerNBody = async (schema: any) => {
        Object.assign(this.reqParamsContainer, this.request.body);
        let values = await this.validateRequestContainer(schema);
        return values;
    }

    public validateRequestQueryParams = async (schema: any, req: Request) => {
        let result = await this.validate(schema, req.query);
        return result;
    }

    public setParamFromBody(key: string): RequestParamsValidatorCoordinator {
        super.setParamFromBody(key);
        return this;
    }

    public setParamFromParams(key: string): RequestParamsValidatorCoordinator {
        super.setParamFromParams(key);
        return this;
    }

    public setParamFromParamsAs(key: string, as: string): RequestParamsValidatorCoordinator {
        super.setParamFromParamsAs(key, as);
        return this;
    }

    public setParamFromQueryStr(key: string): RequestParamsValidatorCoordinator {
        super.setParamFromQueryStr(key);
        return this;
    }

} 