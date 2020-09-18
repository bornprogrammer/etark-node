import { Router } from "express";
import { serviceCenterControllerIns } from "@app/features/service-center/ServiceCenterController";
import { BaseRoutes } from "../BaseRoutes";

export class ServiceCenterRoutes extends BaseRoutes {

    public setRoutes = (): Router => {

        this.router.get("/:id", this.setCtrlMethod(serviceCenterControllerIns.getOrderList));

        this.router.post("/:id", this.setCtrlMethod(serviceCenterControllerIns.addServiceCenterOrderDetails));

        this.router.get("/payment/pickup_delivery/:id", this.setCtrlMethod(serviceCenterControllerIns.getPaymentDetailsToMakePayment));
        this.router.patch("/activity/:pickup_delivery_id/:activity_type", this.setCtrlMethod(serviceCenterControllerIns.setActivity));

        this.router.get("/activities/:pickup_delivery_id/:activity_type", this.setCtrlMethod(serviceCenterControllerIns.setActivity));

        this.router.post("/dispatch-details/:pickup_delivery_id", this.setCtrlMethod(serviceCenterControllerIns.addDispatchDetail));

        this.router.post("/auth/login", this.setCtrlMethod(serviceCenterControllerIns.login));

        this.router.get("/:id/orders-trends", this.setCtrlMethod(serviceCenterControllerIns.getOrderTrends));

        this.router.get("/existance/:city_id/:maker_id", this.setCtrlMethod(serviceCenterControllerIns.doesSCExists));

        return this.router;
    }
}

export const serviceCenterRoutesIns = new ServiceCenterRoutes();