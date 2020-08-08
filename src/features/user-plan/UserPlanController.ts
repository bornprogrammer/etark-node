import { BaseController } from "@app/controllers/BaseController";
import { Request, Response } from "express";
import { userPlanServiceIns } from "./UserPlanService";
import { UserPlanRequestParamCoordinator } from "./UserPlanRequestParamCoordinator";
import { ObjectHelper } from "@app/helpers/ObjectHelper";
import { AppConstants } from "@app/constants/AppConstants";

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
        let params = { paytm_resp: req.body };
        let paytmResp = await this.getCtrlMethodCoordinator().setMethod({ callableFunction: userPlanServiceIns.paytmCallback, callableFunctionParams: params }).returnResp(req, res);
        console.log("paytmResp", paytmResp);
        let queryStr = ObjectHelper.buildStrFromKeyNValueOfObject({ status: paytmResp.STATUS, orderId: paytmResp.ORDERID }, "=", "&");
        let urlToRedirect = AppConstants.CLIENT_URL_AFTER_PAYTM_RESPONSE + "confirm?" + queryStr;
        console.log(urlToRedirect);
        res.redirect(urlToRedirect);
    }
}

export const userPlanControllerIns = new UserPlanController();