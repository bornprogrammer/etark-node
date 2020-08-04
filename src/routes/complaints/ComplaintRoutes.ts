
import { complaintControllerIns } from "@app/features/complaints/ComplaintController";
import express, { Router } from 'express';
import { multerUploadFileMiddlewareIns } from "@app/middlewares/MulterUploadFileMiddleware";

export class ComplaintRoutes {

    public static setRoutes(): Router {

        let router: express.Router = express.Router();

        router.post("/", complaintControllerIns.addComplaints);

        router.post("/:id/device-images", complaintControllerIns.addDeviceImages);

        router.post("/upload-invoice", multerUploadFileMiddlewareIns.uploadSingle("invoice"), complaintControllerIns.uploadInvoice);

        router.post("/upload-device-image", multerUploadFileMiddlewareIns.uploadSingle("device-image"), complaintControllerIns.uploadInvoice);
        return router;
    }

}