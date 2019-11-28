import BaseController from '@app/controllers/BaseController';
import DIContainer from '@app/DIContainer';
import SampleRepositoryService, { sampleRepositoryService } from '@app/modules/sample/SampleRepositoryService';
import { NextFunction, Request, Response } from 'express-serve-static-core';

export default class SampleController extends BaseController  {

    constructor(sampleRepositoryService: SampleRepositoryService) {
        super(sampleRepositoryService);

    }

    public create = async (req: Request, res: Response, next: NextFunction ) => {

        try {
            const sample = await this.mRepositoryService.create(req.body);
            return DIContainer.responseService.sendResponse('sample');
        } catch (error) {
           DIContainer.responseService.sendErrorResponse(error);
        }

    }

}

export const sampleController  =   new SampleController(sampleRepositoryService);
