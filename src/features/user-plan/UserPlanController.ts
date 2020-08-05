import { BaseController } from "@app/controllers/BaseController";
import { Request, Response } from "express";
import { userPlanServiceIns } from "./UserPlanService";
import { userPlanRepositoryIns } from "./UserPlanRepository";
import { UserPlanRequestParamCoordinator } from "./UserPlanRequestParamCoordinator";

export class UserPlanController extends BaseController {

    /**
     *
     */
    constructor() {
        super();
    }

    public addPlan = async (req: Request, res: Response) => {
        let params = UserPlanRequestParamCoordinator.getInstance(req).getAddUsePlanParams();
        await this.getCtrlMethodCoordinator().setMethod({ callableFunction: userPlanServiceIns.addPlan, callableFunctionParams: params }).send(req, res);
    }

    public paytmCallback = async (req: Request, res: Response) => {
        let params = { resp: req.body };
        this.getCtrlMethodCoordinator().setMethod({ callableFunction: userPlanServiceIns.paytmCallback, callableFunctionParams: params }).send(req, res);
    }
}

export const userPlanControllerIns = new UserPlanController();