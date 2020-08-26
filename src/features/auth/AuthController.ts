import { Request, Response } from "express";
import { BaseController } from "./../../controllers/BaseController";
import { AuthRepositoryService, authRepositoryServiceIns } from "./AuthRepositoryService";
import { AuthRequestParamsCoordinator } from "./AuthRequestParamsCoordinator";

class AuthController extends BaseController {

    protected mService: AuthRepositoryService;
    /**
     *
     */
    constructor(authService: AuthRepositoryService) {
        super();
        this.mService = authService;
    }

    public login = async (req: Request, res: Response) => {
        let params = await AuthRequestParamsCoordinator.getInstance(req).getLoginParams(req);
        let result = await this.getCtrlMethodCoordinator().setMethod({ callableFunction: this.mService.login, callableFunctionParams: params }).send(req, res);
        return result;
    }

    public createUser = async (req: Request, res: Response) => {
        let params = await AuthRequestParamsCoordinator.getInstance(req).getCreateUserParams(req);
        return await this.getCtrlMethodCoordinator().setMethod({ callableFunction: this.mService.createUser, callableFunctionParams: params }).send(req, res);
    }

}

export const authControllerIns = new AuthController(authRepositoryServiceIns);