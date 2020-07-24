import { ResponseCodesEnum } from '@app/enums/ResponseCodesEnum';
import BaseError from '@app/errors/BaseError';

export class TokenNotSentError extends BaseError {

    constructor() {
        super('BAD_REQUEST', 'Token not sent error', ResponseCodesEnum.BAD_REQUEST);
    }

}
