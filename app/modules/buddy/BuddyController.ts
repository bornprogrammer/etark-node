import BaseController from '@app/controllers/BaseController';
import DIContainer from '@app/DIContainer';
import DishRepositoryService, { dishRepositoryService } from '@app/modules/Dish/DishRepositoryService';
import { NextFunction, Request, Response } from 'express-serve-static-core';

export default class BuddyController extends BaseController  {

    constructor() {
        super(null);

    }

    public buddyDishes = async (req: Request, res: Response, next: NextFunction ) => {

        try {
            console.log('request body', req.body);
            const buddy = await dishRepositoryService.buddyDishes(req.body);

            console.log('DETAILS', buddy);
            // return DIContainer.responseService.sendResponse(buddy);
        } catch (error) {
        //    DIContainer.responseService.sendErrorResponse(error);
        }
    }

}

export const buddyController  =   new BuddyController();
