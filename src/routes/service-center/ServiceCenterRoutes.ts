import { Router } from "express";
import { serviceCenterControllerIns } from "@app/features/service-center/ServiceCenterController";
import { BaseRoutes } from "../BaseRoutes";

export class ServiceCenterRoutes extends BaseRoutes {

    public setRoutes = (): Router => {

        this.router.get("/:id", this.setCtrlMethod(serviceCenterControllerIns.getOrderList));

        this.router.post("/:id", this.setCtrlMethod(serviceCenterControllerIns.addServiceCenterOrderDetails));

        this.router.patch("/activity/:pickup_delivery_id/:activity_type", this.setCtrlMethod(serviceCenterControllerIns.setActivity));

        return this.router;
    }
}

export const serviceCenterRoutesIns = new ServiceCenterRoutes();