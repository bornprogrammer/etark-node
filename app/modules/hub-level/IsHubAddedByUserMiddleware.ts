import { middlewareMethodHandlerIns } from '@app/method-handler/MiddlewareMethodHandler';
import BaseMiddleware from '@app/middlewares/BaseMiddleware';
import AppSessionService from '@app/services/AppSessionService';
import { NextFunction, Request, Response } from 'express';
import { hubLevelRepositoryServiceIns } from './HubLevelRepositoryService';

export class IsHubAddedByUserMiddleware extends BaseMiddleware {

    public execute(req: Request, res: Response, next: NextFunction) {
        // tslint:disable-next-line: max-line-length
        middlewareMethodHandlerIns.setMethodHandler(hubLevelRepositoryServiceIns.isHubAddedByUser).setParams({ userId: AppSessionService.getUserId(req), params: req.params }).invokeNextWhenTrue(res, next);
    }
}

export const IsHubAddedByUserMiddlewareIns = new IsHubAddedByUserMiddleware();
