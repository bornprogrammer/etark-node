import ErrorFactory from '@app/errors/ErrorFactory';
import { responseServiceIns } from '@app/response-handler/ResponseService';
import { NextFunction, Response } from 'express';
import MethodHandler from './MethodHandler';

class MiddlewareMethodHandler extends MethodHandler {
    constructor() {
        super();
    }

    /**
     * will invoke the method
     */
    public invoke = async (res: Response) => {
        try {
            const clone = this.getCloned();
            const result = await clone.callable(clone.methodParams);
            return result;
        } catch (error) {
            throw new ErrorFactory(error);
        }
    }

    /**
     * will invoke the set method n call the next function
     */
    public async invokeNextWhenTrue(res: Response, next: NextFunction) {
        try {
            const clone = this.getCloned();
            const result = await clone.callable(clone.methodParams);
            if (result && result.length > 0) {
                next();
            }
        } catch (error) {
            responseServiceIns.sendErrorResponse(res, new ErrorFactory(error));
        }
    }
}

export const middlewareMethodHandlerIns = new MiddlewareMethodHandler();
