import BaseController from '@app/controllers/BaseController';
import { ctrlMethodHandlerIns } from '@app/method-handler/CtrlMethodHandler';
import { Request, Response } from 'express';

import { FoodyQuestRepositoryService, foodyQuestRepositoryServiceIns } from './FoodyQuestRepositoryService';

class FoodyQuestConsoleController extends BaseController {

    constructor(foodyQuestRepositoryService: FoodyQuestRepositoryService) {
        super(foodyQuestRepositoryService);
    }

    public cron = async (req: Request, res: Response) => {
        ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.cron).call(req, res);
    }

    public updatePreviousQuestById = async (req: Request, res: Response) => {
        ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.updatePreviousCronTask).setParams({ quest_id: req.params.questId }).call(req, res);
    }

    public migrate = async (req: Request, res: Response) => {

        


    }


}

export const foodyQuestConsoleControllerIns = new FoodyQuestConsoleController(foodyQuestRepositoryServiceIns);
