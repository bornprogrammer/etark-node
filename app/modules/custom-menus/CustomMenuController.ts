import BaseController from '@app/controllers/BaseController';
import DIContainer from '@app/DIContainer';
import Logger from '@app/services/Logger';
import { NextFunction, Request, Response } from 'express';
import CustomMenuRepositoryService from './CustomMenuRepositoryService';
import { customMenuRepositoryService } from './CustomMenuRepositoryService';

class CustomMenuController extends BaseController {
    constructor(customMenuRepositoryService: CustomMenuRepositoryService) {
        super(customMenuRepositoryService);
    }

    public createCustomMenu = async (req: Request, res: Response, next: NextFunction) => {
        // console.log("[REQUEST OBJECT]", req)
        try {
            const customMenu = await this.mRepositoryService.create(req.body);
            // return DIContainer.responseService.sendResponse(customMenu);
        } catch (error) {

            //    DIContainer.responseService.sendErrorResponse(error);
        }
    }

    public editBasicDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('why the hell i m heresss');
            const customMenu = await this.mRepositoryService.editBasicDetails(req.body);
            // return DIContainer.responseService.sendResponse(customMenu);
        } catch (error) {
            //    DIContainer.responseService.sendErrorResponse(error);
        }
    }

    public getCustomMenuFromId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('why the hell i m here');
            const customMenu = await this.mRepositoryService.getCustomMenuFromId(req.body);
            // return this.successResponse(res, '', {customMenu});
        } catch (error) {
            next(error);
        }
    }

}

export default new CustomMenuController(customMenuRepositoryService);
