import express from 'express';
import { notificationsControllerIns } from './NotificationsController';

export class NotificationsRoutes {

    public static setRoutes() {
        const router: express.Router = express.Router();
        router.post('/send', notificationsControllerIns.send);
        router.get('/test', notificationsControllerIns.testPns);
        router.get('/test1', notificationsControllerIns.testPns1);
        router.get('/test2', notificationsControllerIns.testPns2);
        router.post('/subscribe', notificationsControllerIns.subscribe);
        router.post('/sendSms', notificationsControllerIns.sendSms);
        router.delete('/subscribe/:pnsEventName/:entityType/:entityOriginId', notificationsControllerIns.unSubscribe);
        return router;
    }
}