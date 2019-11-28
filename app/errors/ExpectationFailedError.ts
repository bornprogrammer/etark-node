import { ResponseCodesEnum } from '@app/enums/ResponseCodesEnum';
import BaseError from './BaseError';

export default class ExpectationFailedError extends BaseError {
    constructor(message?: string) {
        super(message || 'Something went wrong', message, ResponseCodesEnum.EXCEPTION_FAILED);
    }
}
