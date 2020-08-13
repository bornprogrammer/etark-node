import express, { Router } from "express";
import { masterControllerIns } from "@app/features/master/MasterController";

export class MasterRoutes {

    public static setRoutes(): Router {

        let router: express.Router = express.Router();

        router.get("/categories/:id/makers", masterControllerIns.getMakerListByCategoryId);

        router.get("/merchants/:type", masterControllerIns.getMerchantList);

        router.get("/plans", masterControllerIns.getPlans);

        router.get("/cities", masterControllerIns.getCities);

        router.get("/test-api", masterControllerIns.testApi);

        return router;

    }

}