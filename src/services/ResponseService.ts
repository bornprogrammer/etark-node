
import { Request, Response } from 'express';
import { UtilsHelper } from '@app/helpers/UtilsHelper';
import HttpResponseFoundEntity from '@app/entities/HttpResponseFoundEntity';
import HttpResourcesUpdatedEntity from '@app/entities/HttpResourcesUpdatedEntity';
import HttpResponseNotFoundEntity from '@app/entities/HttpResponseNotFoundEntity';
import HttpResourcesNotUpdatedEntity from '@app/entities/HttpResourcesNotUpdatedEntity';
import { HttpResponseError } from '@app/errors/HttpResponseError';
import HttpResponseEntity from '@app/entities/HttpResponseEntity';
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
        if (UtilsHelper.isMethodReturnedValueTruthy(data)) {
            if (req.method.toLowerCase() === 'get') {
                responseEntity = new HttpResponseFoundEntity(data, "succes");
            } else {
                responseEntity = new HttpResourcesUpdatedEntity(data, "resources updated");
            }
        } else {
            // const message = langHelperIns.getFailedMessage(req);
            if (req.method.toLowerCase() === 'get') {
                responseEntity = new HttpResponseNotFoundEntity("no response found");
            } else {
                responseEntity = new HttpResourcesNotUpdatedEntity("there is an error while updating");
            }
        }
        this.send(response, responseEntity);
    }

    /**
     * would be used to send response in case of any kind of error
     * @param errorExp
     */
    public sendErrorResponse(response: Response, errorExp: HttpResponseError) {
        const errorEntity = new HttpResponseEntity(errorExp.message, errorExp.httpResponseCodes);
        this.send(response, errorEntity);
    }

    private send(response: Response, httpResponseEntity: HttpResponseEntity) {
        response.status(httpResponseEntity.httpStatus).send(httpResponseEntity);
    }
}

export const responseServiceIns = new ResponseService();
