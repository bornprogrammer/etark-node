import express from 'express';
import { localityControllerIns } from './LocalityController';

export default class LocalityRoutes {

    public static setRoutes(router: express.Router) {
        // console.log('routes here');
        router.get('/', localityControllerIns.searchLocality);
        return router;
    }
}
