import { ResponseCodesEnum } from '@app/enums/ResponseCodesEnum';
import BaseError from './BaseError';

export default class NotImplemented extends BaseError {
    constructor(message: string) {
        super('Not Implemented Error', message, ResponseCodesEnum.NO_CONTENT);
    }
}
