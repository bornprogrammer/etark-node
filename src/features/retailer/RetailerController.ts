
import { BaseController } from "@app/controllers/BaseController";
import { Request, Response } from "express";
import { retailerRepositoryServiceIns } from "./RetailerRepositoryService";
import { RetailerRequestParamCoordinator } from "./RetailerRequestParamCoordinator";


export class RetailerController extends BaseController {

    constructor() {
        super();
    }

    public retailerLogin = async (req: Request, res: Response) => {
        let params = await RetailerRequestParamCoordinator.getInstance(req).getRetailerLoginParams();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: retailerRepositoryServiceIns.retailerLogin, callableFunctionParams: params }).send(req, res);
    }

    public addCustomerDetails = async (req: Request, res: Response) => {
        let params = await RetailerRequestParamCoordinator.getInstance(req).getAddCustomerDetailsParams();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: retailerRepositoryServiceIns.processCustomerDetails, callableFunctionParams: params }).send(req, res);
    }

}

export const retailerControllerIns = new RetailerController();