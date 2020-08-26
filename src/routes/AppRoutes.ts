
import express from 'express';

import { AuthRoutes } from './auth/AuthRoutes';
import { MasterRoutes } from './master/MasterRoutes';
import { ComplaintRoutes } from './complaints/ComplaintRoutes';
import { UserPlanRoutes } from './user-plans/UserPlanRoutes';
import { UserRoutes } from './user/UserRoutes';
import { ServiceCenterRoutes, serviceCenterRoutesIns } from './service-center/ServiceCenterRoutes';

export default class AppRoutes {

    public static routes() {

        const router = express.Router();

        router.use("/auth", AuthRoutes.setRoutes());

        router.use("/masters", MasterRoutes.setRoutes());

        router.use("/complaints", ComplaintRoutes.setRoutes());

        router.use("/user-plan", UserPlanRoutes.setRoutes());

        router.use("/users", UserRoutes.setRoutes());

        router.use("/sc", serviceCenterRoutesIns.setRoutes());

        return router;
    }
}
