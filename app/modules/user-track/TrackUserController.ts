import BaseController from '@app/controllers/BaseController';
import { ctrlMethodHandlerIns } from '@app/method-handler/CtrlMethodHandler';
import AppSessionService from '@app/services/AppSessionService';
import { Request, Response } from 'express';
import { TrackUserRepositoryService, trackUserRepositoryServiceIns } from './TrackUserRepositoryService';

class TrackUserController extends BaseController {

    constructor(trackUserRepositoryService: TrackUserRepositoryService) {
        super(trackUserRepositoryService);
    }

    public updateBannerCount = async (req: Request, res: Response) => {
        // tslint:disable-next-line: max-line-length
        const params = { userId: AppSessionService.getUserId(req), ...req.body };
        await ctrlMethodHandlerIns.setParams(params)
            .setMethodHandler(this.mRepositoryService.updateBannerCount).call(req, res);
    }

}

export const trackUserControllerIns = new TrackUserController(trackUserRepositoryServiceIns);
