import express from 'express';
import { localityControllerIns } from '../localities/LocalityController';
import { hubLevelControllerIns } from './HubLevelController';
import { IsHubAddedByUserMiddleware, IsHubAddedByUserMiddlewareIns } from './IsHubAddedByUserMiddleware';

export default class HubLevelRoutes {

    public static setRoutes(router: express.Router) {
        router.get('/user-added-hubs', hubLevelControllerIns.getUserAddedHubs);
        router.get('/home', hubLevelControllerIns.hubHome);
        router.get('/admin-added-hubs', hubLevelControllerIns.getAdminAddedHubs);
        router.get('/private-kitchen-hubs', hubLevelControllerIns.getPrivateKitchenHubs);
        router.get('/hubs', hubLevelControllerIns.searchHubs);
        router.get('/hubs-v1', hubLevelControllerIns.searchHubsV1);
        router.get('/filterHubs', hubLevelControllerIns.filterSearchHubs);
        router.post('/slot', hubLevelControllerIns.buySlot);
        router.get('/localities', localityControllerIns.searchLocality);
        router.post('/hub', hubLevelControllerIns.buySecondaryHub);
        router.delete('/hubs/:userHubId', IsHubAddedByUserMiddlewareIns.execute, hubLevelControllerIns.deleteHub);
        return router;
    }
}
