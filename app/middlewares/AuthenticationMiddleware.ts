import ErrorFactory from '@app/errors/ErrorFactory';
import { TokenNotSentError } from '@app/errors/TokenNotSentError';
import { middlewareMethodHandlerIns } from '@app/method-handler/MiddlewareMethodHandler';
import { userSessionService } from '@app/modules/User/UserSessionService';
import { responseServiceIns } from '@app/response-handler/ResponseService';
import AppSessionService from '@app/services/AppSessionService';
import { NextFunction, Request, Response } from 'express';
import AppMiddleware from './AppMiddleware';

class AuthenticationMiddleware extends AppMiddleware {

    public execute = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (this.isIgnored(req) === true) {
                next();
            } else {
                const userId = await middlewareMethodHandlerIns.setMethodHandler(userSessionService.checkToken)
                    .setParams(req.headers.token).invoke(res);
                AppSessionService.setUserId(req, userId);
                next();
            }
        } catch (error) {
            responseServiceIns.sendErrorResponse(res, new ErrorFactory(error));
        }
    }
}

export const authenticationMiddlewareIns = new AuthenticationMiddleware();
