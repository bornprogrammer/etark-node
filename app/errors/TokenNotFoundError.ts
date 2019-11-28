import { ResponseCodesEnum } from '@app/enums/ResponseCodesEnum';
import BaseError from '@app/errors/BaseError';

export class TokenNotFoundError extends BaseError {

    constructor() {
        super('Token Not Found Error', 'UNAUTHORIZED', 401);

    }

}
