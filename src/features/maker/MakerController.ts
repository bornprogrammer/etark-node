import { BaseController } from "@app/controllers/BaseController";
import { Request, Response } from "express";
import { MakerRequestParamsCooridnator } from "./MakerRequestParamsCooridnator";
import { MakerService, makerServiceIns } from "./MakerService";

export class MakerController extends BaseController {

    private makerService: MakerService;

    /**
     *
     */
    constructor(makerService: MakerService) {
        super();
        this.makerService = makerService;
    }

    public getMakerListByCategoryId = async (req: Request, res: Response) => {
        let params = MakerRequestParamsCooridnator.getInstance(req).getMakerListByCategoryIdParams();
        this.getCtrlMethodCoordinator().setMethod({ callableFunction: this.makerService.getMakerListByCategoryId, callableFunctionParams: params });
    }
}

export const makerControllerIns = new MakerController(makerServiceIns);