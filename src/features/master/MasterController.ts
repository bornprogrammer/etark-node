import { BaseController } from "@app/controllers/BaseController";
import { MasterRequestParamCoordinator } from "./MasterRequestParamCoordinator";
import { MasterService, masterServiceIns } from "./MasterService";
import { Request, Response } from "express";


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
        await this.getCtrlMethodCoordinator().setMethod({ callableFunction: this.mMasterService.getMakerListByCategoryId, callableFunctionParams: params }).send(req, res);
    }

    public getMerchantList = async (req: Request, res: Response) => {
        let params = MasterRequestParamCoordinator.getInstance(req).getMerchantListParams();
        await this.getCtrlMethodCoordinator().setMethod({ callableFunction: this.mMasterService.getMerchantList, callableFunctionParams: params }).send(req, res);
    }
}

export const masterControllerIns = new MasterController(masterServiceIns);
