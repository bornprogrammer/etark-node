
import { complaintControllerIns } from "@app/features/complaints/ComplaintController";
import express, { Router } from 'express';

export class ComplaintRoutes {

    public static setRoutes(): Router {

        let router: express.Router = express.Router();

        router.post("/", complaintControllerIns.addComplaints);

        return router;
    }

}