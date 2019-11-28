import BaseController from '@app/controllers/BaseController';
import { ctrlMethodHandlerIns } from '@app/method-handler/CtrlMethodHandler';
import AppSessionService from '@app/services/AppSessionService';
import { Request, Response } from 'express';
import { fileHelperIns } from '../helper/FileHelper';
import { resourceHelperIns } from '../helper/ResourceHelper';
import { EventRepositoryService, eventRepositoryServiceIns } from './EventRepositoryService';
import {transformCategoryGoodies, TransformCategoryGoodies} from './TransformCategoryGoodies';
import { responseServiceIns } from '@app/response-handler/ResponseService';

class EventController extends BaseController {

    constructor(eventRepositoryService: EventRepositoryService) {
        super(eventRepositoryService);
    }

    public getCookingClassById = async (req: Request, res: Response) => {
        await ctrlMethodHandlerIns
            .setParams({ userId: AppSessionService.getUserId(req), ...req.params })
            .setMethodHandler(this.mRepositoryService.getCookingClassById).call(req, res);
    }

    public getCuratedProductsById = async (req: Request, res: Response) => {
        await ctrlMethodHandlerIns
            .setParams({ userId: AppSessionService.getUserId(req), ...req.params })
            .setMethodHandler(this.mRepositoryService.getCuratedProductsById).call(req, res);
    }

    public getCarouselEvents = async (req: Request, res: Response) => {
        await ctrlMethodHandlerIns
            .setParams({ userId: AppSessionService.getUserId(req), ...req.params })
            .setMethodHandler(this.mRepositoryService.getCarouselEvents).call(req, res);
    }

    public getCarouselEventsV1 = async (req: Request, res: Response) => {
        await ctrlMethodHandlerIns
            .setParams({ userId: AppSessionService.getUserId(req), ...req.params })
            .setMethodHandler(this.mRepositoryService.getCarouselEventsV1).call(req, res);
    }


    public getCookingClassList = async (req: Request, res: Response) => {
        await ctrlMethodHandlerIns
            .setParams({ userId: AppSessionService.getUserId(req), ...req.params })
            .setMethodHandler(this.mRepositoryService.getCookingClassList).call(req, res);
    }

    public getCuratedProductList = async (req: Request, res: Response) => {
        const result = await ctrlMethodHandlerIns
            .setParams({ userId: AppSessionService.getUserId(req), ...req.params, ...req.query })
            .setMethodHandler(this.mRepositoryService.getCuratedProductList).get();
        responseServiceIns.sendResponse(req, res, transformCategoryGoodies(result, 'single').transform());
    }

    public getCookingClassHistory = async (req: Request, res: Response) => {
        await ctrlMethodHandlerIns
            .setParams({ userId: AppSessionService.getUserId(req), ...req.params })
            .setMethodHandler(this.mRepositoryService.getCookingClassHistory).call(req, res);
    }

    public getCuratedProductHistory = async (req: Request, res: Response) => {
        await ctrlMethodHandlerIns
            .setParams({ userId: AppSessionService.getUserId(req), ...req.params })
            .setMethodHandler(this.mRepositoryService.getCuratedProductHistory).call(req, res);
    }

    public getBookedEventsCount = async (req: Request, res: Response) => {
        await ctrlMethodHandlerIns
            .setParams({ userId: AppSessionService.getUserId(req), ...req.params })
            .setMethodHandler(this.mRepositoryService.getBookedEventsCount).call(req, res);
    }

    public goodiesAllCategories = async (req: Request, res: Response) => {
        const result = await ctrlMethodHandlerIns
            .setParams({ userId: AppSessionService.getUserId(req), ...req.params, ...req.query })
            .setMethodHandler(this.mRepositoryService.goodiesAllCategories).get();
        responseServiceIns.sendResponse(req, res, transformCategoryGoodies(result, 'all').transform());
        // const result = await ctrlMethodHandlerIns
        //     .setParams({ userId: AppSessionService.getUserId(req), ...req.params, ...req.query })
        //     .setMethodHandler(this.mRepositoryService.goodiesAllCategories).call(req, res);
    }
}

export const eventControllerIns = new EventController(eventRepositoryServiceIns);
