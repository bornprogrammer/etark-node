import { authenticationMiddlewareIns } from '@app/middlewares/AuthenticationMiddleware';
import { validatorMiddlewareIns } from '@app/middlewares/ValidatorMiddleware';
import { Router } from 'express';

export default class AppMiddlewareBootstrapper {

    public static bootStrapp(router: Router) {
        router.use('/', authenticationMiddlewareIns.execute);
        router.use('/', validatorMiddlewareIns.execute);
        return router;
    }
}
