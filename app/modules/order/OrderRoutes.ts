import express from 'express';
import { cartControllerIns } from '../V1cart/CartController';
import { orderControllerIns } from './OrderController';
export default class OrderRoutes {

    public static setRoutes() {
        const router: express.Router = express.Router();
        router.post('', orderControllerIns.addOrder);
        router.delete('/:id', orderControllerIns.deleteOrder);
        router.get('/:id', orderControllerIns.getWebOrderInfo);
        return router;
    }
}
