
import { Request } from "express";
import RequestParamsCoordinator from "@app/coordinators/request-params-cordinators/RequestParamsCoordinator";

export class AuthRequestParamCoordinator extends RequestParamsCoordinator {
    /**
     *
     */
    protected constructor(request: Request) {
        super(request);
    }

    public static getInstance(request: Request): AuthRequestParamCoordinator {
        return new AuthRequestParamCoordinator(request);
    }

    public getLoginParams(): any {
        return this.setParamFromBody("phone_number").setParamFromBody("password").coordinate();
    }

    public getCreateUserParams(): any {
        return this.setParamFromBody("mobileNumber").setParamFromBody("password").setParamFromBody("name").setParamFromBody("email").coordinate();
    }
}