
import { HttpResponseError } from './HttpResponseError';
import { HttpResponseCode } from '@app/enums/HttpResponseCodes';

export default class BadHttpRequestError extends HttpResponseError {

    /**
     *
     */
    constructor() {
        super(HttpResponseCode.BAD_REQUEST, "There is bad request");
    }

}
