import express from 'express';
import { cashfreeControllerIns } from '../cashfree/CashfreeController';
import { cartControllerIns } from './CartController';
export default class CartRoutesV1 {

    public static setRoutes() {
        const router: express.Router = express.Router();
        router.post('', cartControllerIns.addCart);
        router.put('/:id', cartControllerIns.updateCart);
        router.delete('/:id', cartControllerIns.deleteCart);
        router.post('/cash_free_response', cashfreeControllerIns.logCashfreeResponse);
        router.delete('/:id', cartControllerIns.deleteCart);
        return router;
    }
}
