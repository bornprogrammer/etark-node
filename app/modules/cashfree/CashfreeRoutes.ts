import express from 'express';
import { cashfreeControllerIns } from './CashfreeController';

export class CashfreeRoutes {

    public static setRoutes() {
        const router: express.Router = express.Router();

        router.post('/web-return', cashfreeControllerIns.logCashfreeResponseNRedirect);

        return router;
    }
}
