import { buddyController } from '@app/modules/buddy/BuddyController';
import express from 'express';

export  default  class BuddyRoutes {

    public static setRoutes(router: express.Router) {
        router.get('/dishes', buddyController.buddyDishes);

        return router;
    }
}
