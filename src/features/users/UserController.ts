import { BaseController } from "@app/controllers/BaseController";
import { Request, Response } from "express";
import { UserRequestParamsCoordinator } from "./UserRequestParamsCoordinator";
import { userRepositoryServiceIns } from "./UserRepositoryService";

export class UserController extends BaseController {

    /**
     *
     */
    constructor() {
        super();
    }

    public addAddress = async (req: Request, res: Response) => {
        let params = UserRequestParamsCoordinator.getInstance(req).getAddAddressParams();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunctionParams: params, callableFunction: userRepositoryServiceIns.addAddress }).send(req, res);
    }

    public getSuccessPageDetail = async (req: Request, res: Response) => {
        let params = UserRequestParamsCoordinator.getInstance(req).getSuccessPageDetailParams();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunctionParams: params, callableFunction: userRepositoryServiceIns.getSuccessPageDetail }).send(req, res);
    }

    public downloadInvoice = async (req: Request, res: Response) => {

    }

    public scPayment = async (req: Request, res: Response) => {
        let params = UserRequestParamsCoordinator.getInstance(req).getSCPaymentParams();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunctionParams: params, callableFunction: userRepositoryServiceIns.getSuccessPageDetail }).send(req, res);
    }

    public getUserListing = async (req: Request, res: Response) => {
        let params = await UserRequestParamsCoordinator.getInstance(req).getUserListingParams();
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: userRepositoryServiceIns.getUserListing, callableFunctionParams: params }).send(req, res);
    }

    public getUserOrderCounts = async (req: Request, res: Response) => {
        return { total_complaints: 0, completed: 0, in_progress: 0, incomplete: 0 };
    }

}

export const userControllerIns = new UserController();