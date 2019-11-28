import DIContainer from '@app/DIContainer';
import BaseError from '@app/errors/BaseError';
import { responseServiceIns } from '@app/response-handler/ResponseService';
import { NextFunction, Request, Response } from 'express';

/**
 * @description base middleware class would be implemented by every middleware class
 * @author Sandeep Kosta
 */
export default abstract class BaseMiddleware {

    constructor() {
    }

    public abstract execute(req: Request, res: Response, next: NextFunction);

    public sendErrorResponse(res: Response, err: BaseError) {
        responseServiceIns.sendErrorResponse(res, err);
    }
}
