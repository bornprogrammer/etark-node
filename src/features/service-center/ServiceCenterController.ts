import { BaseController } from "@app/controllers/BaseController";
import { Request, Response } from "express";
import { ServiceCenterRequestParamCoordinator } from "./ServiceCenterRequestParamCoordinator";
import { serviceCenterRepositoryServiceIns } from "./ServiceCenterRepositoryService";
import { ObjectHelper } from "@app/helpers/ObjectHelper";
import config from "config";

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
        let params = await ServiceCenterRequestParamCoordinator.getInstance(req).getAddServiceCenterOrderDetails();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: serviceCenterRepositoryServiceIns.processServiceCenterOrderDetails, callableFunctionParams: params }).send(req, res);
    }

    public setActivity = async (req: Request, res: Response) => {
        let params = await ServiceCenterRequestParamCoordinator.getInstance(req).getSetActivityParams();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: serviceCenterRepositoryServiceIns.setActivity, callableFunctionParams: params }).send(req, res);
    }

    public addDispatchDetail = async (req: Request, res: Response) => {
        let params = await ServiceCenterRequestParamCoordinator.getInstance(req).getAddDispatchDetailParams();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: serviceCenterRepositoryServiceIns.addDispatchDetail, callableFunctionParams: params }).send(req, res);
    }

    public login = async (req: Request, res: Response) => {
        let params = await ServiceCenterRequestParamCoordinator.getInstance(req).getLoginParams();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: serviceCenterRepositoryServiceIns.login, callableFunctionParams: params }).send(req, res);
    }

    public getOrderTrends = async (req: Request, res: Response) => {
        let params = await ServiceCenterRequestParamCoordinator.getInstance(req).getOrderTrendsParams();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: serviceCenterRepositoryServiceIns.getOrderTrends, callableFunctionParams: params }).send(req, res);
    }

    public doesSCExists = async (req: Request, res: Response) => {
        let params = await ServiceCenterRequestParamCoordinator.getInstance(req).getDoesSCExistsParams();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: serviceCenterRepositoryServiceIns.doesSCExists, callableFunctionParams: params }).send(req, res);
    }

    public getPaymentDetailsToMakePayment = async (req: Request, res: Response) => {
        let params = await ServiceCenterRequestParamCoordinator.getInstance(req).getPaymentDetailsToMakePaymentParams();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: serviceCenterRepositoryServiceIns.getPaymentDetailsToMakePayment, callableFunctionParams: params }).send(req, res);
    }

    public paytmCallback = async (req: Request, res: Response) => {
        let params = req.body;
        await this.getCtrlMethodCoordinator().setMethod({ callableFunction: serviceCenterRepositoryServiceIns.paytmCallback, callableFunctionParams: params }).send(req, res);
        const status = params.STATUS === "TXN_SUCCESS" ? "success" : "failure";
        const queryStr = ObjectHelper.buildStrFromKeyNValueOfObject({ type: status, id: "null" }, "=", "&");
        const urlToRedirect = config.get("client_base_url") + "servicePayment?" + queryStr;
        console.log("queryStr", urlToRedirect);
        res.redirect(urlToRedirect);
    }
}

export const serviceCenterControllerIns = new ServiceCenterController();