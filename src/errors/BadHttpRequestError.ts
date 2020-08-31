
import { HttpResponseError } from './HttpResponseError';
import { HttpResponseCode } from '@app/enums/HttpResponseCodes';

export default class BadHttpRequestError extends HttpResponseError {

    /**
     *
     */
    constructor(message?: string) {
        super(HttpResponseCode.BAD_REQUEST, message || "Please check params/body again");
    }

}
