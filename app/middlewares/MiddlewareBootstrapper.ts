import {appMiddleware} from '@app/middlewares/middlewares.schema';
import express from 'express';

export default class MiddlewareBootstrapper {

    public static bootstrap(app: express.Application) {
        this.bootstrapAppLevelMiddleware(app);
    }

    private static bootstrapAppLevelMiddleware(app: express.Application) {
        appMiddleware.forEach((middlewareCallback) => {
            app.use(middlewareCallback);

        });
    }

}
