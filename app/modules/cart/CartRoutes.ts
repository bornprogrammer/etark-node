import express from 'express';
import { cashfreeControllerIns } from '../cashfree/CashfreeController';
import { cartControllerIns } from './CartController';
export default class CartRoutes {

    public static setRoutes() {
        const router: express.Router = express.Router();
        router.post('', cartControllerIns.addCart);
        router.post('/cash_free_response', cashfreeControllerIns.logCashfreeResponse);
        router.delete('/:id', cartControllerIns.deleteCartItems);
        return router;
    }
}
