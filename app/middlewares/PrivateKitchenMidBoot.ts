import { Router } from 'express';
import BaseMiddleware from './BaseMiddleware';
import DishOwnerMiddleware from './DishOwnerMiddleware';

export default class PrivateKitchenMidBoot {

    public static bootStrapp(router: Router) {
        router.use('/d1/a', DishOwnerMiddleware.execute);
        router.use('/d2/g', DishOwnerMiddleware.execute);
        router.use('/d3/f', DishOwnerMiddleware.execute);
        router.use('/', DishOwnerMiddleware.execute);
        return router;
    }

}
