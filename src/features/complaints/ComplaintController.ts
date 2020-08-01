import { BaseController } from "@app/controllers/BaseController";
import { ComplainRequestParamsCoordinator } from "./ComplainRequestParamsCoordinator";
import { Request, Response } from "express";
import { complaintServiceIns } from "./ComplaintService";

export class ComplaintController extends BaseController {
    /**
     *
     */
    constructor() {
        super();
    }

    public addComplaints = async (req: Request, res: Response) => {
        let params = ComplainRequestParamsCoordinator.getInstance(req).getAddComplaintsParams();
        await this.getCtrlMethodCoordinator().setMethod({ callableFunction: complaintServiceIns.addComplaints, callableFunctionParams: params }).send(req, res);
    }
}

export const complaintControllerIns = new ComplaintController();