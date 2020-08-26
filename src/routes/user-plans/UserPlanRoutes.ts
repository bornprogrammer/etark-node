import { Router } from "express";
import { userPlanControllerIns } from "@app/features/user-plan/UserPlanController";
import { BaseRoutes } from "../BaseRoutes";


export class UserPlanRoutes extends BaseRoutes {

    /**
     *
     */
    constructor() {
        super();
    }

    public setRoutes(): Router {

        this.router.post("/", this.setCtrlMethod(userPlanControllerIns.addUserPlan));

        this.router.put("/:id", this.setCtrlMethod(userPlanControllerIns.updateUserPlan));

        this.router.post("/:user_plan_id/pay", this.setCtrlMethod(userPlanControllerIns.makePayment));

        this.router.post("/paytm-callback", this.setCtrlMethod(userPlanControllerIns.paytmCallback));

        return this.router;
    }
}

export const userPlanRoutesIns = new UserPlanRoutes();