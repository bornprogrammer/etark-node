import { isOwnerOfCustomMenuMiddlewareIns } from '@app/middlewares/IsOwnerOfCustomMenuMiddleware';
import { Router } from 'express';
import BaseMiddleware from '../middlewares/BaseMiddleware';
import DishOwnerMiddleware from '../middlewares/DishOwnerMiddleware';

export default class IsOwnerOfCustomMenuMiddlewareBootstrapper {

    public static bootStrapp(router: Router) {
        router.use('/feature1/second', isOwnerOfCustomMenuMiddlewareIns.execute);
        return router;
    }

}
