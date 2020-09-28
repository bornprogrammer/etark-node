
import express from 'express';

import { authRoutesIns } from './auth/AuthRoutes';
import { masterRoutesIns } from './master/MasterRoutes';
import { complaintRoutesIns } from './complaints/ComplaintRoutes';
import { userPlanRoutesIns } from './user-plans/UserPlanRoutes';
import { userRoutesIns } from './user/UserRoutes';
import { serviceCenterRoutesIns } from './service-center/ServiceCenterRoutes';
import { retailerRoutesIns } from './retailer/RetailerRoutes';

export default class AppRoutes {

    public static routes() {

        const router = express.Router();

        router.use("/auth", authRoutesIns.setRoutes());

        router.use("/masters", masterRoutesIns.setRoutes());

        router.use("/complaints", complaintRoutesIns.setRoutes());

        router.use("/user-plan", userPlanRoutesIns.setRoutes());

        router.use("/users", userRoutesIns.setRoutes());

        router.use("/sc", serviceCenterRoutesIns.setRoutes());

        router.use("/retailer", retailerRoutesIns.setRoutes());

        return router;
    }
}
