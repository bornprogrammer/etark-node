
import { Router } from "express";
import { BaseRoutes } from "../BaseRoutes";
import { retailerControllerIns } from "@app/features/retailer/RetailerController";


export class RetailerRoutes extends BaseRoutes {


    public setRoutes(): Router {

        this.router.post("/login", this.setCtrlMethod(retailerControllerIns.retailerLogin));

        return this.router;
    }
}

export const retailerRoutesIns = new RetailerRoutes();