import { Router } from 'express';
import { authControllerIns } from "./../../features/auth/AuthController";
import { BaseRoutes } from '../BaseRoutes';

export class AuthRoutes extends BaseRoutes {

    /**
     *
     */
    constructor() {
        super();
    }

    public setRoutes(): Router {

        this.router.post("/login", this.setCtrlMethod(authControllerIns.login));

        this.router.post("/", this.setCtrlMethod(authControllerIns.createUser));

        return this.router;

    }
}

export const authRoutesIns = new AuthRoutes();