import { appMiddleware, middlewareForSelectedAPI } from '@app/middlewares/middlewares.schema';
import express, { Router } from 'express';
import PrivateKitchenMidBoot from '../middlewares/PrivateKitchenMidBoot';
import AppMiddlewareBootstrapper from './AppMiddlewareBootstrapper';
import IsOwnerOfCustomMenuMiddlewareBootstrapper from './IsOwnerOfCustomMenuMiddlewareBootstrapper';

export default class MiddlewareBootstrapper {

    public static bootstrap() {
        const router = express.Router();
        this.bootstrapAppLevelMiddleware(router);
        return router;
    }

    /**
     * @param app level middleware bootstrapper
     */
    private static bootstrapAppLevelMiddleware(router: Router) {
        AppMiddlewareBootstrapper.bootStrapp(router);
    }

    /**
     * @param isownerof cusom menu dish level middleware bootstrapper
     */
    private static bootstrapIsOwnerOfCustomMenuMiddleware(router: Router) {
        IsOwnerOfCustomMenuMiddlewareBootstrapper.bootStrapp(router);
    }

}
