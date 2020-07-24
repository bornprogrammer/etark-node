import { ResponseCodesEnum } from '@app/enums/ResponseCodesEnum';
import BaseError from './BaseError';

export default class CustomError extends BaseError {
    constructor(message: string) {
        super('Custom Error', message, ResponseCodesEnum.BAD_REQUEST);
    }
}
