import { Coordinator } from "../Coordinator";
import { Request } from "express";
import { UtilsHelper } from "@app/helpers/UtilsHelper";

export default abstract class RequestParamsCoordinator implements Coordinator {

    protected request: Request;

    private reqParamsContainer: any;

    protected constructor(request: Request) {
        this.request = request;
        this.reqParamsContainer = {};
    }

    public setParamFromBody(key: string): RequestParamsCoordinator {
        this.reqParamsContainer[key] = this.request.body[key] || null;
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
        this.reqParamsContainer[key] = this.reqParamsContainer[key] && this.reqParamsContainer[key].strlen > 0 ? this.reqParamsContainer[key] : null;
        return this;
    }

    coordinate() {
        return this.reqParamsContainer;
    }

} 