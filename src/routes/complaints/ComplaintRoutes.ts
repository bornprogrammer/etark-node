
import { complaintControllerIns } from "@app/features/complaints/ComplaintController";
import express, { Router } from 'express';
import multer from 'multer';

export class ComplaintRoutes {

    public static setRoutes(): Router {

        let router: express.Router = express.Router();

        router.post("/", complaintControllerIns.addComplaints);

        var storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'uploads/');
            },
            filename: (req, file, cb) => {
                cb(null, file.fieldname + '-' + Date.now() + ".png");
            }
        })
        let multers = multer({ storage: storage });
        router.post("/upload-invoice", multers.single("invoice"), complaintControllerIns.uploadInvoice);

        return router;
    }

}