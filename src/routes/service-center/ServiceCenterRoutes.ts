import express, { Router } from "express";
import { serviceCenterControllerIns } from "@app/features/service-center/ServiceCenterController";


export class ServiceCenterRoutes {

    public static setRoutes = (): Router => {

        let router = express.Router();

        router.get("/:id", serviceCenterControllerIns.getOrderList);

        router.post("/:id", serviceCenterControllerIns.addServiceCenterOrderDetails);

        return router;
    }

}