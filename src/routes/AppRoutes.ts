
import express from 'express';

import { AuthRoutes } from './auth/AuthRoutes';
import { MasterRoutes } from './master/MasterRoutes';

export default class AppRoutes {

    public static routes() {

        const router = express.Router();

        router.use("/auth", AuthRoutes.setRoutes(router));

        router.use("/masters", MasterRoutes.setRoutes(router));

        return router;
    }
}
