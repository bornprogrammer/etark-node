import { Coordinator } from "../Coordinator";
import { Request } from "express";


export default class RequestParamsCoordinator implements Coordinator {

    protected request: Request;

    private paramsContainer: any;

    constructor(request: Request) {
        this.request = request;
    }

    public setParamFromBody(key: string): RequestParamsCoordinator {
        this.paramsContainer[key] = this.request.body[key];
        return this;
    }

    public setParamFromParams(key: string): RequestParamsCoordinator {
        this.paramsContainer[key] = this.request.params[key];
        return this;
    }

    public setParamFromQueryStr(key: string): RequestParamsCoordinator {
        this.paramsContainer[key] = this.request.query[key];
        return this;
    }

    coordinate() {
        return this.paramsContainer;
    }

} 