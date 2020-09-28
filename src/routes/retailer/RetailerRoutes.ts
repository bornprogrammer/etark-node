
import { Router } from "express";
import { BaseRoutes } from "../BaseRoutes";
import { retailerControllerIns } from "@app/features/retailer/RetailerController";


export class RetailerRoutes extends BaseRoutes {


    public setRoutes(): Router {

        this.router.post("/login", this.setCtrlMethod(retailerControllerIns.retailerLogin));

        this.router.post("/:id/customer", this.setCtrlMethod(retailerControllerIns.addCustomerDetails));

        this.router.get("/", this.setCtrlMethod(retailerControllerIns.getRetailerList));

        return this.router;
    }
}

export const retailerRoutesIns = new RetailerRoutes();