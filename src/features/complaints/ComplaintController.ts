import { BaseController } from "@app/controllers/BaseController";
import { ComplainRequestParamsCoordinator } from "./ComplainRequestParamsCoordinator";
import { Request, Response } from "express";
import { complaintServiceIns } from "./ComplaintRepositoryService";

export class ComplaintController extends BaseController {
    /**
     *
     */
    constructor() {
        super();
    }

    public addComplaints = async (req: Request, res: Response) => {
        let params = ComplainRequestParamsCoordinator.getInstance(req).getAddComplaintsParams();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: complaintServiceIns.addComplaints, callableFunctionParams: params }).send(req, res);
    }

    public updateComplaints = async (req: Request, res: Response) => {
        let params = ComplainRequestParamsCoordinator.getInstance(req).getUpdateComplaintsParams();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: complaintServiceIns.updateComplaints, callableFunctionParams: params }).send(req, res);
    }

    public addDeviceImages = async (req: Request, res: Response) => {
        let params = ComplainRequestParamsCoordinator.getInstance(req).getAddDeviceImagesParams();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: complaintServiceIns.addDeviceImages, callableFunctionParams: params }).send(req, res);
    }

    public updateDeviceImages = async (req: Request, res: Response) => {
        let params = ComplainRequestParamsCoordinator.getInstance(req).getUpdateDeviceImagesParams();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: complaintServiceIns.updateDeviceImages, callableFunctionParams: params }).send(req, res);
    }

    public uploadInvoice = async (req: Request, res: Response) => {
        // await this.getCtrlMethodCoordinator().setMethod({ callableFunction: complaintServiceIns.uploadInvoice, callableFunctionParams: req['file'] }).send(req, res);
        // nodeMailerServiceIns.sendHtml("service@etark.in", "iamabornprogrammer@gmail.com", "support email", "<h1>this is header file</h1>");
        console.log(req['file']);
        return await req['file'];
        // await this.getCtrlMethodCoordinator().sendData(req, res, req['file']);
    }

    public getChancesOfWinning = async (req: Request, res: Response) => {
        let params = ComplainRequestParamsCoordinator.getInstance(req).getChancesOfWinningParams();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: complaintServiceIns.getChancesOfWinning, callableFunctionParams: params }).send(req, res);
    }

    public addCompensation = async (req: Request, res: Response) => {
        let params = ComplainRequestParamsCoordinator.getInstance(req).getAddCompensationParams();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: complaintServiceIns.addCompensation, callableFunctionParams: params }).send(req, res);
    }

    public updateCompensation = async (req: Request, res: Response) => {
        let params = ComplainRequestParamsCoordinator.getInstance(req).getUpdateCompensationParams();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: complaintServiceIns.updateCompensation, callableFunctionParams: params }).send(req, res);
    }

    public addComplainStrength = async (req: Request, res: Response) => {
        let params = await ComplainRequestParamsCoordinator.getInstance(req).getaddComplainStrengthParams();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: complaintServiceIns.addComplainStrength, callableFunctionParams: params }).send(req, res);
    }

    public updateComplainStrength = async (req: Request, res: Response) => {
        let params = await ComplainRequestParamsCoordinator.getInstance(req).getaddComplainStrengthParams();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: complaintServiceIns.updateComplainStrength, callableFunctionParams: params }).send(req, res);
    }
}

export const complaintControllerIns = new ComplaintController();