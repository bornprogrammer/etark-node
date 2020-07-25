import { HttpResponseCode } from '@app/enums/HttpResponseCodes';
import BaseError from '@app/errors/BaseError';

export class TokenNotSentError extends BaseError {

    constructor() {
        super('BAD_REQUEST', 'Token not sent error', HttpResponseCode.BAD_REQUEST);
    }

}
