import DIContainer from '@app/DIContainer';
import express from 'express';

export default class CustomMenuPostRoutes {

    public static setRoutes(router: express.Router) {
        router.post('', DIContainer.customMenuPostController.postCustomMenu);
        return router;
    }
}
