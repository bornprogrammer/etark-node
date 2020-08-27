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
        let params = await ServiceCenterRequestParamCoordinator.getInstance(req).getOrderListParams();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: serviceCenterRepositoryServiceIns.getOrderList, callableFunctionParams: params }).send(req, res);
    }

    public addServiceCenterOrderDetails = async (req: Request, res: Response) => {
        let params = await ServiceCenterRequestParamCoordinator.getInstance(req).getAddServiceCenterOrderDetails(req);
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: serviceCenterRepositoryServiceIns.processServiceCenterOrderDetails, callableFunctionParams: params }).send(req, res);
    }

    public setActivity = async (req: Request, res: Response) => {
        let params = await ServiceCenterRequestParamCoordinator.getInstance(req).getSetActivityParams(req);
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: serviceCenterRepositoryServiceIns.setActivity, callableFunctionParams: params }).send(req, res);
    }
}

export const serviceCenterControllerIns = new ServiceCenterController();