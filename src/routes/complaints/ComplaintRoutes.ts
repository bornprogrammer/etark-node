
import { complaintControllerIns } from "@app/features/complaints/ComplaintController";
import express, { Router } from 'express';
import { multerUploadFileMiddlewareIns } from "@app/middlewares/MulterUploadFileMiddleware";
import { BaseRoutes } from "../BaseRoutes";

export class ComplaintRoutes extends BaseRoutes {

    /**
     *
     */
    constructor() {
        super();
    }

    public setRoutes(): Router {

        this.router.post("/", this.setCtrlMethod(complaintControllerIns.addComplaints));

        this.router.post("/:id/strengths", this.setCtrlMethod(complaintControllerIns.addComplainStrength));

        this.router.put("/:id/strengths", this.setCtrlMethod(complaintControllerIns.updateComplainStrength));

        this.router.put("/:id", this.setCtrlMethod(complaintControllerIns.updateComplaints));

        this.router.post("/:id/device-images", this.setCtrlMethod(complaintControllerIns.addDeviceImages));

        this.router.put("/:id/device-images", this.setCtrlMethod(complaintControllerIns.updateDeviceImages));

        this.router.get("/:id/winning-chances", this.setCtrlMethod(complaintControllerIns.getChancesOfWinning));

        this.router.post("/:id/compentsation", this.setCtrlMethod(complaintControllerIns.addCompensation));

        this.router.put("/:id/compentsation/:complain_detail_id", this.setCtrlMethod(complaintControllerIns.updateCompensation));

        this.router.post("/upload-invoice", multerUploadFileMiddlewareIns.uploadSingle("invoice"), this.setCtrlMethod(complaintControllerIns.uploadInvoice));

        this.router.post("/upload-device-image", multerUploadFileMiddlewareIns.uploadSingle("device-image"), this.setCtrlMethod(complaintControllerIns.uploadInvoice));
        return this.router;
    }

}

export const complaintRoutesIns = new ComplaintRoutes();