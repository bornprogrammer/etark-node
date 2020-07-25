import MethodCordinator from "./MethodCordinator";
import { Response, Request } from "express";
import MethodCoordinatorEntity from "./MethodCoordinatorEntity";
import { responseServiceIns } from "@app/services/ResponseService";

export class CtrlMethodCoordinator extends MethodCordinator {

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

    public async send(request: Request, res: Response) {
        let result = null;
        try {
            result = await this.coordinate();
            responseServiceIns.sendResponse(request, res, result);
        } catch (error) {
            responseServiceIns.sendErrorResponse(res, error);
        }
    }


}