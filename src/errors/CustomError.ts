import { HttpResponseCode } from '@app/enums/HttpResponseCodes';
import BaseError from './BaseError';

export default class CustomError extends BaseError {
    constructor(message: string) {
        super('Custom Error', message, HttpResponseCode.BAD_REQUEST);
    }
}
