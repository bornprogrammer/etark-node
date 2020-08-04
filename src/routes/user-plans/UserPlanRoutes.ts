import express, { Router, response } from "express";
import { userPlanControllerIns } from "@app/features/user-plan/UserPlanController";




export class UserPlanRoutes {

    public static setRoutes(): Router {

        let router = express.Router();

        router.post("/paytm-callback", userPlanControllerIns.paytmCallback);

        return router;
    }

}