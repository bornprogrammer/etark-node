import { HttpResponseCode } from '@app/enums/HttpResponseCodes';
import BaseError from '@app/errors/BaseError';
import { HttpResponseError } from './HttpResponseError';

export class TokenNotFoundError extends HttpResponseError {

    constructor() {
        super(HttpResponseCode.UNAUTHORIZED, "token is invalid");
    }

}
