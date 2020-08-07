import express, { Router } from "express";
import { userPlanControllerIns } from "@app/features/user-plan/UserPlanController";




export class UserPlanRoutes {

    public static setRoutes(): Router {

        let router = express.Router();

        router.post("/", userPlanControllerIns.addUserPlan);

        router.post("/:user_plan_id/pay", userPlanControllerIns.makePayment);

        router.post("/paytm-callback", userPlanControllerIns.paytmCallback);

        return router;
    }

}