import { BaseController } from "@app/controllers/BaseController";
import { Request, Response } from "express";
import { userPlanServiceIns } from "./UserPlanService";
import { UserPlanRequestParamCoordinator } from "./UserPlanRequestParamCoordinator";

export class UserPlanController extends BaseController {
    /**
     *
     */
    constructor() {
        super();
    }

    public addUserPlan = async (req: Request, res: Response) => {
        let params = UserPlanRequestParamCoordinator.getInstance(req).getAddUsePlanParams();
        await this.getCtrlMethodCoordinator().setMethod({ callableFunction: userPlanServiceIns.addUserPlan, callableFunctionParams: params }).send(req, res);
    }

    public makePayment = async (req: Request, res: Response) => {
        let params = UserPlanRequestParamCoordinator.getInstance(req).getMakePaymentParams();
        await this.getCtrlMethodCoordinator().setMethod({ callableFunction: userPlanServiceIns.makePayment, callableFunctionParams: params }).send(req, res);
    }

    public paytmCallback = async (req: Request, res: Response) => {
        // let params = { resp: req.body };
        this.getCtrlMethodCoordinator().setMethod({ callableFunction: userPlanServiceIns.paytmCallback, callableFunctionParams: req.body }).send(req, res);
    }
}

export const userPlanControllerIns = new UserPlanController();