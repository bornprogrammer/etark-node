import express from 'express';
import { localityControllerIns } from '../localities/LocalityController';
import { trackUserControllerIns } from './TrackUserController';

export default class TrackUserRoutes {

    public static setRoutes(router: express.Router) {
        router.post('/banner', trackUserControllerIns.updateBannerCount);
        return router;
    }
}
