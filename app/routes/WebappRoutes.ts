import EventRoutes from '@app/modules/events/EventWebappRoutes';
import express from 'express';
export default class AppRoutes {

    public static routes() {
        const router = express.Router();
        router.use('/events', EventRoutes.setRoutes(router));
        return router;
    }
}
