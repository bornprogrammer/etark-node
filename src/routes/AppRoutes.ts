
import express from 'express';

import { AuthRoutes } from './auth/AuthRoutes';
import { CategoryRoutes } from './category/CategoryRoutes';
export default class AppRoutes {

    public static routes() {

        const router = express.Router();

        router.use("/auth", AuthRoutes.setRoutes(router));

        router.use("/categories", CategoryRoutes.setRoutes(router));

        return router;
    }
}
