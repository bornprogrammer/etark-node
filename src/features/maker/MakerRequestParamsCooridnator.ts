
import RequestParamsCoordinator from "@app/coordinators/request-params-cordinators/RequestParamsCoordinator";
import { Request } from "express";

export class MakerRequestParamsCooridnator extends RequestParamsCoordinator {

    /**
     *
     */
    constructor(request: Request) {
        super(request);
    }

    public static getInstance(request: Request): MakerRequestParamsCooridnator {
        return new MakerRequestParamsCooridnator(request);
    }

    public getMakerListByCategoryIdParams() {
        return this.setParamFromParams("id").coordinate();
    }



}