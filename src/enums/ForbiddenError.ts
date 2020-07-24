import { ResponseCodesEnum } from '@app/enums/ResponseCodesEnum';
import BaseError from './BaseError';

export default class ForbiddenError extends BaseError {
    constructor(message: string) {
        super('No Content Error', message, ResponseCodesEnum.NO_CONTENT);
    }
}
