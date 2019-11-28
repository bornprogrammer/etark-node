import express from 'express';
import { eventWebappControllerIns } from './EventWebappController';

export default class EventWebappRoutes {

    public static setRoutes(router: express.Router) {
        router.get('/curated-products/:eventId/city/:cityId', eventWebappControllerIns.getCuratedProductsById);
        router.get('/curated-products/:cityId', eventWebappControllerIns.getCuratedProductList);
        router.get('/curated-products/all-categories/:cityId', eventWebappControllerIns.goodiesAllCategories);
        return router;
    }
}
