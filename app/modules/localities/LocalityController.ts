import BaseController from '@app/controllers/BaseController';
import { ctrlMethodHandlerIns } from '@app/method-handler/CtrlMethodHandler';
import { Request, Response } from 'express';
import { LocalityRepositoryService, localityRepositoryServiceIns } from './LocalityRepositoryService';

class LocalityController extends BaseController {

    constructor(localityRepositoryService: LocalityRepositoryService) {
        super(localityRepositoryService);
    }

    public searchLocality = async (req: Request, res: Response) => {
        await ctrlMethodHandlerIns.setMethodHandler(this.mRepositoryService.searchLocality)
        .setParams(req.query).call(req, res);
    }
}

export const localityControllerIns = new LocalityController(localityRepositoryServiceIns);
