import MethodCoordinator from "./MethodCordinator";
import { Response, Request } from "express";
import MethodCoordinatorEntity from "../../entities/MethodCoordinatorEntity";
import { responseServiceIns } from "@app/services/ResponseService";
import { HttpResponseError } from "@app/errors/HttpResponseError";
import InternalError from "@app/errors/InternalError";

export class CtrlMethodCoordinator extends MethodCoordinator {

    /**
     *
     */
    constructor() {
        super();
    }

    public setMethod(methodCoordinatorEntity: MethodCoordinatorEntity): CtrlMethodCoordinator {
        super.setMethod(methodCoordinatorEntity);
        return this;
    }

    public send = async (request: Request, res: Response) => {
        let result = null;
        try {
            result = await this.coordinate();
            responseServiceIns.sendResponse(request, res, result);
        } catch (error) {
            console.log('error', error);
            this.sendError(res, error);
        }
    }

    private sendError = (response: Response, error: any) => {
        if (error instanceof HttpResponseError) {
            responseServiceIns.sendErrorResponse(response, error);
        } else {
            responseServiceIns.sendErrorResponse(response, new InternalError());
        }
    }


}