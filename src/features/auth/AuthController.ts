import { Request, Response } from "express";
import { BaseController } from "./../../controllers/BaseController";

class AuthController extends BaseController {

    /**
     *
     */
    constructor() {
        super();
    }

    public login = async (req: Request, res: Response) => {
        res.send("logged in successfully");
    }

}

export const authControllerIns = new AuthController();