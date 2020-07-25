import { Request, Response } from "express";
import MethodCordinator from "@app/coordinators/method-cordinators/MethodCordinator";
import { BaseController } from "@app/controllers/BaseController";

class AuthController extends BaseController {

    /**
     *
     */
    constructor(methodCordinator: MethodCordinator) {
        super(methodCordinator);
    }

    public login = async (req: Request, res: Response) => {
        // this.methodCordinator.setMethod(this.)
    }

}

export const authControllerIns = new AuthController(new MethodCordinator());