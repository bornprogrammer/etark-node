import { Router } from "express";
import { masterControllerIns } from "@app/features/master/MasterController";

export class MasterRoutes {

    public static setRoutes(router: Router): Router {

        router.get("/categories/:id/makers", masterControllerIns.getMakerListByCategoryId);

        router.get("/merchants/:type", masterControllerIns.getMerchantList);

        return router;

    }

}