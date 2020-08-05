import { BaseController } from "@app/controllers/BaseController";
import { Request, Response } from "express";
import { UserRequestParamsCoordinator } from "./UserRequestParamsCoordinator";
import { userServiceIns } from "./UserService";


export class UserController extends BaseController {

    /**
     *
     */
    constructor() {
        super();
    }

    public addAddress = async (req: Request, res: Response) => {
        let params = UserRequestParamsCoordinator.getInstance(req).getAddAddressParams();
        await this.getCtrlMethodCoordinator().setMethod({ callableFunctionParams: params, callableFunction: userServiceIns.addAddress }).send(req, res);
    }

}

export const userControllerIns = new UserController();