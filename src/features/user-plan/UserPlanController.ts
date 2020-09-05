import { BaseController } from "@app/controllers/BaseController";
import { Request, Response, NextFunction } from "express";
import { userPlanRepositoryServiceIns } from "./UserPlanRepositoryService";
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
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: userPlanRepositoryServiceIns.addUserPlan, callableFunctionParams: params }).send(req, res);
    }

    public updateUserPlan = async (req: Request, res: Response) => {
        let params = UserPlanRequestParamCoordinator.getInstance(req).getUpdateUsePlanParams();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: userPlanRepositoryServiceIns.updateUserPlan, callableFunctionParams: params }).send(req, res);
    }

    public makePayment = async (req: Request, res: Response) => {
        let params = UserPlanRequestParamCoordinator.getInstance(req).getMakePaymentParams();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: userPlanRepositoryServiceIns.makePayment, callableFunctionParams: params }).send(req, res);
    }

    public paytmCallback = async (req: Request, res: Response) => {
        let params = { paytm_resp: req.body };
        let result = await this.getCtrlMethodCoordinator().setMethod({ callableFunction: userPlanRepositoryServiceIns.paytmCallback, callableFunctionParams: params }).returnResp(req, res);
        const status = result ? params.paytm_resp.STATUS : "TXN_FAILURE";
        const queryStr = ObjectHelper.buildStrFromKeyNValueOfObject({ status, orderId: params.paytm_resp.ORDERID }, "=", "&");
        const urlToRedirect = AppConstants.CLIENT_URL_AFTER_PAYTM_RESPONSE + "/confirm?" + queryStr;
        console.log("queryStr", urlToRedirect);
        res.redirect(urlToRedirect);
    }
}

export const userPlanControllerIns = new UserPlanController();