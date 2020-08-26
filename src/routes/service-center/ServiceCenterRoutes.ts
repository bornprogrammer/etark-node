import express, { Router } from "express";
import { serviceCenterControllerIns } from "@app/features/service-center/ServiceCenterController";
import { BaseRoutes } from "../BaseRoutes";

export class ServiceCenterRoutes extends BaseRoutes {

    public setRoutes = (): Router => {

        // let router = express.Router();

        this.router.get("/:id", serviceCenterControllerIns.getOrderList);

        // this.router.post("/:id", async (req, res) => {
        //     try {
        //         await serviceCenterControllerIns.addServiceCenterOrderDetails(req, res);
        //     } catch (error) {
        //         responseServiceIns.sendErrorResponse(res, error);
        //     }
        // });

        this.router.post("/:id", this.setCtrlMethod(serviceCenterControllerIns.addServiceCenterOrderDetails));
        return this.router;
    }

}

export const serviceCenterRoutesIns = new ServiceCenterRoutes();