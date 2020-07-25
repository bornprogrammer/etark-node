
import { Request } from "express";
import RequestParamsCoordinator from "@app/coordinators/request-params-cordinators/RequestParamsCoordinator";

export default class AuthRequestParamCoordinator extends RequestParamsCoordinator {

    /**
     *
     */
    constructor(request: Request) {
        super(request);
    }

    public getLoginParams() {
        return this.setParamFromBody("phone_number").setParamFromBody("password").coordinate();
    }

    public getSignParams() {
        return this.setParamFromBody("phone_number").setParamFromBody("password").coordinate();
    }

}