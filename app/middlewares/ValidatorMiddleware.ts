import { appAJV } from '@app/app';
import ErrorFactory from '@app/errors/ErrorFactory';
import { TokenNotSentError } from '@app/errors/TokenNotSentError';
import { middlewareMethodHandlerIns } from '@app/method-handler/MiddlewareMethodHandler';
import { fileHelperIns } from '@app/modules/helper/FileHelper';
import { resourceHelperIns } from '@app/modules/helper/ResourceHelper';
import { userSessionService } from '@app/modules/User/UserSessionService';
import { responseServiceIns } from '@app/response-handler/ResponseService';
import AppSessionService from '@app/services/AppSessionService';
import { NextFunction, Request, Response } from 'express';
import AppMiddleware from './AppMiddleware';

class ValidatorMiddleware extends AppMiddleware {

    public execute = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (this.isIgnored(req) === true) {
                next();
            } else {
                // console.log(req.originalUrl);
                // console.log(req['_parsedUrl']);
                // const validatorSchemaPath = 'validation-schema/' + resourceHelperIns.getResourceParams(req);
                // console.log(validatorSchemaPath);
                // const schema = fileHelperIns.readJSONSyncUsingRequire(validatorSchemaPath);
                // console.log(schema);
                // resourceHelperIns.getResourceParams(req);
                // const compile = appAJV.compile(schema[resourceHelperIns.getResourceParams(req)]);
                next();
            }
        } catch (error) {
            responseServiceIns.sendErrorResponse(res, new ErrorFactory(error));
        }
    }
}

export const validatorMiddlewareIns = new ValidatorMiddleware();
