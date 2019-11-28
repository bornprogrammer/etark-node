import { sampleController } from '@app/modules/sample/SampleController';
import express from 'express';

export  default  class SampleRoutes {

    public static setRoutes(router: express.Router) {
        router.post('', sampleController.create);

        return router;
    }
}
