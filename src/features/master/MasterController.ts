import { BaseController } from "@app/controllers/BaseController";
import { MasterRequestParamCoordinator } from "./MasterRequestParamCoordinator";
import { MasterService, masterServiceIns } from "./MasterService";
import { Request, Response } from "express";
import { paytmServiceIns } from "@app/services/PaytmService";

export class MasterController extends BaseController {

    private mMasterService: MasterService;
    /**
     *
     */
    constructor(masterService: MasterService) {
        super();
        this.mMasterService = masterService;
    }

    public getMakerListByCategoryId = async (req: Request, res: Response) => {
        let params = MasterRequestParamCoordinator.getInstance(req).getMakerListByCategoryIdParams();
        let s = paytmServiceIns.generatePaytmTxnToken({ amount: 5, orderId: "5", userId: 5 });
        await this.getCtrlMethodCoordinator().setMethod({ callableFunction: this.mMasterService.getMakerListByCategoryId, callableFunctionParams: params }).send(req, res);
    }

    public getMerchantList = async (req: Request, res: Response) => {
        let params = MasterRequestParamCoordinator.getInstance(req).getMerchantListParams();
        await this.getCtrlMethodCoordinator().setMethod({ callableFunction: this.mMasterService.getMerchantList, callableFunctionParams: params }).send(req, res);
    }

    public getPlans = async (req: Request, res: Response) => {
        await this.getCtrlMethodCoordinator().setMethod({ callableFunction: this.mMasterService.getPlans }).send(req, res);
    }

    public getCities = async (req: Request, res: Response) => {
        await this.getCtrlMethodCoordinator().setMethod({ callableFunction: this.mMasterService.getCities }).send(req, res);
    }

    public addServiceCenter = async (req: Request, res: Response) => {

    }
}

export const masterControllerIns = new MasterController(masterServiceIns);
