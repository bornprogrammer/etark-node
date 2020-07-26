import { HttpResponseCode } from '@app/enums/HttpResponseCodes';
import { HttpResponseError } from './HttpResponseError';

export class TokenNotSentError extends HttpResponseError {

    constructor() {
        super(HttpResponseCode.BAD_REQUEST, "token is not sent");
    }

}
