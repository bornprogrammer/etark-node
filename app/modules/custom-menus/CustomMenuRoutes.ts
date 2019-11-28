import express from 'express';
import customMenuController from './CustomMenuController';

export  default  class CustomMenuRoutes {

    public static setRoutes(router: express.Router) {
        router.post('', customMenuController.createCustomMenu);
        router.put('', customMenuController.editBasicDetails);
        router.get('', customMenuController.getCustomMenuFromId);
        return router;
    }
}
