import express from 'express';
import { localityControllerIns } from '../localities/LocalityController';
import { foodyQuestConsoleControllerIns } from './Foody-quest/FoodyQuestConsoleController';

export default class QuestRoutes {

    public static setRoutes() {
        const router: express.Router = express.Router();
        router.get('/foody-cron', foodyQuestConsoleControllerIns.cron);
        router.get('/update-previous-quest/:questId', foodyQuestConsoleControllerIns.updatePreviousQuestById);
        return router;
    }
}