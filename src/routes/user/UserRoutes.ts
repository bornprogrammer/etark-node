import express, { Router } from "express";
import { userControllerIns } from "@app/features/users/UserController";
import { BaseRoutes } from "../BaseRoutes";

export class UserRoutes extends BaseRoutes {

    /**
     *
     */
    constructor() {
        super();
    }

    public setRoutes = (): Router => {

        this.router.post("/:id/addresses", this.setCtrlMethod(userControllerIns.addAddress));

        this.router.get("/:id/payment/:order_id", this.setCtrlMethod(userControllerIns.getSuccessPageDetail));

        this.router.get("/:id/sc/:sc_id/payment", this.setCtrlMethod(userControllerIns.scPayment));

        return this.router;
    }

}

export const userRoutesIns = new UserRoutes();