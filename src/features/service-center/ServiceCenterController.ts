import { BaseController } from "@app/controllers/BaseController";
import { Request, Response } from "express";
import { ServiceCenterRequestParamCoordinator } from "./ServiceCenterRequestParamCoordinator";
import { serviceCenterRepositoryServiceIns } from "./ServiceCenterRepositoryService";



export class ServiceCenterController extends BaseController {
    /**
     *
     */
    constructor() {
        super();
    }

    public getOrderList = async (req: Request, res: Response) => {
        let params = ServiceCenterRequestParamCoordinator.getInstance(req).getOrderListParams();
        await this.getCtrlMethodCoordinator().setMethod({ callableFunction: serviceCenterRepositoryServiceIns.getOrderList, callableFunctionParams: params }).send(req, res);
    }

}

export const serviceCenterControllerIns = new ServiceCenterController();