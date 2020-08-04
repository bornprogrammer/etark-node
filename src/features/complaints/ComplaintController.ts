import { BaseController } from "@app/controllers/BaseController";
import { ComplainRequestParamsCoordinator } from "./ComplainRequestParamsCoordinator";
import { Request, Response } from "express";
import { complaintServiceIns } from "./ComplaintService";
import { nodeMailerServiceIns } from "@app/services/NodeMailerService";

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

    public addDeviceImages = async (req: Request, res: Response) => {
        let params = ComplainRequestParamsCoordinator.getInstance(req).getAddDeviceImagesParams();
        await this.getCtrlMethodCoordinator().setMethod({ callableFunction: complaintServiceIns.addDeviceImages, callableFunctionParams: params }).send(req, res);
    }

    public uploadInvoice = async (req: Request, res: Response) => {
        // await this.getCtrlMethodCoordinator().setMethod({ callableFunction: complaintServiceIns.uploadInvoice, callableFunctionParams: req['file'] }).send(req, res);
        // nodeMailerServiceIns.sendHtml("service@etark.in", "iamabornprogrammer@gmail.com", "support email", "<h1>this is header file</h1>");
        await this.getCtrlMethodCoordinator().sendData(req, res, req['file']);
    }
}

export const complaintControllerIns = new ComplaintController();