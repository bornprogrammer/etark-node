import { Router } from "express";
import { masterControllerIns } from "@app/features/master/MasterController";
import { BaseRoutes } from "../BaseRoutes";

export class MasterRoutes extends BaseRoutes {

    /**
     *
     */
    constructor() {
        super();
    }

    public setRoutes(): Router {

        this.router.get("/categories/:id/makers", this.setCtrlMethod(masterControllerIns.getMakerListByCategoryId));

        this.router.get("/merchants/:type", this.setCtrlMethod(masterControllerIns.getMerchantList));

        this.router.get("/plans", this.setCtrlMethod(masterControllerIns.getPlans));

        this.router.get("/cities", this.setCtrlMethod(masterControllerIns.getCities));

        this.router.get("/test-api", this.setCtrlMethod(masterControllerIns.testApi));

        return this.router;
    }
}

export const masterRoutesIns = new MasterRoutes();