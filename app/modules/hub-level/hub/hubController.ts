import BaseController from '@app/controllers/BaseController';
import { ctrlMethodHandlerIns } from '@app/method-handler/CtrlMethodHandler';
import { Request, Response } from 'express';
import { HubRepositoryService, hubRepositoryServiceIns } from './hubRepositoryService';

class HubController extends BaseController {

    constructor(hubRepositoryService: HubRepositoryService) {
        super(hubRepositoryService);
    }

    public deleteUserAddedSecondaryHub = async (req: Request, res: Response) => {
        await ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.deleteUserAddedSecondaryHub)
        .setParams(req.query).call(req, res);
    }
}

export const hubControllerIns = new HubController(hubRepositoryServiceIns);
