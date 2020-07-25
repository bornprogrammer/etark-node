import { HttpResponseCode } from '@app/enums/HttpResponseCodes';
import BaseError from '@app/errors/BaseError';

export class TokenNotFoundError extends BaseError {

    constructor() {
        super('Token Not Found Error', 'UNAUTHORIZED', 401);

    }

}
