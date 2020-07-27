import { Request } from "express";
import RequestParamsCoordinator from "@app/coordinators/request-params-cordinators/RequestParamsCoordinator";

export class AuthRequestParamsCoordinator extends RequestParamsCoordinator {
    /**
     *
     */
    protected constructor(request: Request) {
        super(request);
    }

    public static getInstance(request: Request): AuthRequestParamsCoordinator {
        return new AuthRequestParamsCoordinator(request);
    }

    public getLoginParams(): any {
        return this.setParamFromBody("mobile_number").setParamFromBody("password").coordinate();
    }

    public getCreateUserParams(): any {
        return this.setParamFromBody("mobile_number").setParamFromBody("password").setParamFromBody("name").setParamFromBody("email").coordinate();
    }
}