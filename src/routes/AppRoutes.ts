
import express from 'express';

import { AuthRoutes } from './auth/AuthRoutes';
import { MasterRoutes } from './master/MasterRoutes';
import { ComplaintRoutes } from './complaints/ComplaintRoutes';

export default class AppRoutes {

    public static routes() {

        const router = express.Router();

        router.use("/auth", AuthRoutes.setRoutes());

        router.use("/masters", MasterRoutes.setRoutes());

        router.use("/complaints", ComplaintRoutes.setRoutes());



        return router;
    }
}
