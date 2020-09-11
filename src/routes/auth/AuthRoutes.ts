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

        this.router.post("/admin-login", this.setCtrlMethod(authControllerIns.adminLogin));

        this.router.post("/", this.setCtrlMethod(authControllerIns.createUser));

        this.router.post("/forgot-password", this.setCtrlMethod(authControllerIns.forgotPassword));

        this.router.put("/reset-password/:email", this.setCtrlMethod(authControllerIns.resetPassword));

        return this.router;
    }
}

export const authRoutesIns = new AuthRoutes();