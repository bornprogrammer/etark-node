import BaseError from '@app/errors/BaseError';
import { inputHelperIns } from '@app/modules/helper/InputHelper';
import { langHelperIns } from '@app/modules/helper/LangHelper';
import ErrorEntity from '@app/response-handler/ErrorEntity';
import { Request, Response } from 'express';
import { ResponseCodesEnum } from '../enums/ResponseCodesEnum';
import ResourcesNotUpdatedEntity from './ResourcesNotUpdatedEntity';
import ResourcesUpdatedEntity from './ResourcesUpdatedEntity';
import ResponseFoundEntity from './ResponseFoundEntity';
import ResponseNotFoundEntity from './ResponseNotFoundEntity';
/**
 * would be instantiated by app utility middleware
 */
export default class ResponseService {
    /**
     * would be used to send the response when either resource found or not found
     * @param data
     */
    public sendResponse(req: Request, response: Response, data: any) {
        let responseEntity = null;
        if (inputHelperIns.isInputValid(data)) {
            if (req.method.toLowerCase() === 'get') {
                responseEntity = new ResponseFoundEntity(data, langHelperIns.getSuccessMessage(req));
            } else {
                responseEntity = new ResourcesUpdatedEntity(data, langHelperIns.getSuccessMessage(req));
            }
        } else {
            const message = langHelperIns.getFailedMessage(req);
            if (req.method.toLowerCase() === 'get') {
                responseEntity = new ResponseNotFoundEntity(message);
            } else {
                responseEntity = new ResourcesNotUpdatedEntity(message);
            }
        }
        response.status(responseEntity.httpStatus).send(responseEntity);
    }

    /**
     * would be used to send response in case of any kind of error
     * @param errorExp
     */
    public sendErrorResponse(response: Response, errorExp: BaseError) {
        const errorEntity = new ErrorEntity(errorExp.message, errorExp.httpStatus);
        response.status(errorEntity.httpStatus).send(errorEntity);
    }
}

export const responseServiceIns = new ResponseService();
