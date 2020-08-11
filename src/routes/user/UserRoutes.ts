import express, { Router } from "express";
import { userControllerIns } from "@app/features/users/UserController";

export class UserRoutes {

    public static setRoutes = (): Router => {

        let router = express.Router();

        router.post("/:id/addresses", userControllerIns.addAddress);

        router.get("/:id/payment/:order_id", userControllerIns.getSuccessPageDetail);

        return router;
    }

}