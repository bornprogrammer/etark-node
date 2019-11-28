import express from 'express';
import { eventControllerIns } from './EventController';

export default class EventRoutes {

    public static setRoutes(router: express.Router) {
        router.get('/cooking-class/:eventId/city/:cityId', eventControllerIns.getCookingClassById);
        router.get('/curated-products/:eventId/city/:cityId', eventControllerIns.getCuratedProductsById);
        router.get('/carousel-v1/:cityId', eventControllerIns.getCarouselEventsV1);
        router.get('/carousel/:cityId', eventControllerIns.getCarouselEvents);
        router.get('/cooking-class/history', eventControllerIns.getCookingClassHistory);
        router.get('/curated-products/history', eventControllerIns.getCuratedProductHistory);
        router.get('/booked-events', eventControllerIns.getBookedEventsCount);
        router.get('/cooking-class/:cityId', eventControllerIns.getCookingClassList);
        router.get('/curated-products/:cityId', eventControllerIns.getCuratedProductList);
        router.get('/curated-products/all-categories/:cityId', eventControllerIns.goodiesAllCategories);
        return router;
    }
}
