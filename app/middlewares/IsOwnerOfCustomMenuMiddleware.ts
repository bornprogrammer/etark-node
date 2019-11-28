import CheckTokenService from '@app/services/CheckTokenService';
import { NextFunction, Request, Response } from 'express';

export default class IsOwnerOfCustomMenuMiddleware {
    public execute(req: Request, res: Response, next: NextFunction) {
        // tslint:disable-next-line: no-console
        console.log('yes i am owner of custom menu');
        next();
    }
}

export const isOwnerOfCustomMenuMiddlewareIns = new IsOwnerOfCustomMenuMiddleware();
