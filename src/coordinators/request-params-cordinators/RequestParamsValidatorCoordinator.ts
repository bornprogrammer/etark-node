import RequestParamsCoordinator from "./RequestParamsCoordinator";
import { Request } from "express";
import BadHttpRequestError from "@app/errors/BadHttpRequestError";


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

    public validateRequestBody = async (schema: any, req: Request) => {
        let result = await this.validate(schema, req.body);
        return result;
    }

    public validateRequestQueryParams = async (schema: any, req: Request) => {
        let result = await this.validate(schema, req.query);
        return result;
    }

    // public setParamFromBody(key: string): RequestParamsValidatorCoordinator {
    //     super.setParamFromBody(key);
    //     return this;
    // }

    // public setParamFromParams(key: string): RequestParamsValidatorCoordcinator {
    //     super.setParamFromParams(key);
    //     return this;
    // }

    // public setParamFromParamsAs(key: string, as: string): RequestParamsValidatorCoordinator {
    //     super.setParamFromParamsAs(key, as);
    //     return this;
    // }

    // public setParamFromQueryStr(key: string): RequestParamsValidatorCoordinator {
    //     super.setParamFromQueryStr(key);
    //     return this;
    // }

} 