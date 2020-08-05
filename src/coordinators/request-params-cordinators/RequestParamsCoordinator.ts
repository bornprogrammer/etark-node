import { Coordinator } from "../Coordinator";
import { Request } from "express";

export default abstract class RequestParamsCoordinator implements Coordinator {

    protected request: Request;

    private reqParamsContainer: any;

    protected constructor(request: Request) {
        this.request = request;
        this.reqParamsContainer = {};
    }

    public setParamFromBody(key: string): RequestParamsCoordinator {
        this.reqParamsContainer[key] = this.request.body[key];
        return this;
    }

    public setParamFromParams(key: string): RequestParamsCoordinator {
        this.reqParamsContainer[key] = this.request.params[key];
        return this;
    }

    public setParamFromParamsAs(key: string, as: string): RequestParamsCoordinator {
        this.reqParamsContainer[as] = this.request.params[key];
        return this;
    }

    public setParamFromQueryStr(key: string): RequestParamsCoordinator {
        this.reqParamsContainer[key] = this.request.query[key];
        return this;
    }

    coordinate() {
        return this.reqParamsContainer;
    }

} 