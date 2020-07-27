
import { Router } from "express";
import { makerControllerIns } from "@app/features/maker/MakerController";



export class CategoryRoutes {

    public static setRoutes(router: Router): Router {

        router.get("/:id/makers", makerControllerIns.getMakerListByCategoryId);

        return router;

    }

}