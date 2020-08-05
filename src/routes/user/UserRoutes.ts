import express, { Router } from "express";
import { userControllerIns } from "@app/features/users/UserController";

export class UserRoutes {

    public static setRoutes = (): Router => {

        let router = express.Router();

        router.post("/:id/addresses", userControllerIns.addAddress);

        return router;
    }

}