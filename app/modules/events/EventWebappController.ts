import BaseController from '@app/controllers/BaseController';
import { ctrlMethodHandlerIns } from '@app/method-handler/CtrlMethodHandler';
import AppSessionService from '@app/services/AppSessionService';
import { Request, Response } from 'express';
import { fileHelperIns } from '../helper/FileHelper';
import { resourceHelperIns } from '../helper/ResourceHelper';
import { EventRepositoryService, eventRepositoryServiceIns } from './EventRepositoryService';

class EventController extends BaseController {

    constructor(eventRepositoryService: EventRepositoryService) {
        super(eventRepositoryService);
    }

    public getCuratedProductsById = async (req: Request, res: Response) => {
        await ctrlMethodHandlerIns
            .setParams({ ...req.params })
            .setMethodHandler(this.mRepositoryService.getCuratedProductsById).call(req, res);
    }

    public getCuratedProductList = async (req: Request, res: Response) => {
        await ctrlMethodHandlerIns
            .setParams({ ...req.params, ...req.query })
            .setMethodHandler(this.mRepositoryService.getCuratedProductList).call(req, res);
    }

    public goodiesAllCategories = async (req: Request, res: Response) => {
        await ctrlMethodHandlerIns
            .setParams({ ...req.params, ...req.query })
            .setMethodHandler(this.mRepositoryService.goodiesAllCategories).call(req, res);
    }
}

export const eventWebappControllerIns = new EventController(eventRepositoryServiceIns);
