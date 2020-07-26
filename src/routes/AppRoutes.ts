
import express from 'express';

import { AuthRoutes } from './auth/AuthRoutes';
export default class AppRoutes {

    public static routes() {

        const router = express.Router();

        router.use("/auth", AuthRoutes.setRoutes(router));

        return router;
    }
}
