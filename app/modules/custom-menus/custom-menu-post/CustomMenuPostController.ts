import BaseController from '@app/controllers/BaseController';
import DIContainer from '@app/DIContainer';
import { NextFunction, Request, Response } from 'express';
import CustomMenuPostRepositoryService from './CustomMenuPostRepositoryService';

export default class CustomMenuPostController extends BaseController {

    constructor(customMenuPostRepositoryService: CustomMenuPostRepositoryService) {
        super(customMenuPostRepositoryService);
    }
    public postCustomMenu = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.mRepositoryService.postCustomMenu(req.body);
            // this.sendResponse(result)
        } catch (error) {

        }

    }

    public editBasicDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.mRepositoryService.postCustomMenu(req.body);
            // this.sendResponse(result);
        } catch (error) {
            // this.sendErrorResponse(error);
        }
    }

    public editDeliveryDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.mRepositoryService.postCustomMenu(req.body);
            // this.sendResponse(result);
        } catch (error) {
            // this.sendErrorResponse(error);
        }

    }

    public postInHubs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.mRepositoryService.postInHubs(req.body);
            // this.sendResponse(result);
        } catch (error) {
            // this.sendErrorResponse(error);
        }

    }

    public postForUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.mRepositoryService.postForUsers(req.body);
            // this.sendResponse(result);
        } catch (error) {
            // this.sendErrorResponse(error);
        }

    }

}
