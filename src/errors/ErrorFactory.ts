import { HttpResponseCode } from '@app/enums/HttpResponseCodes';
import BaseError from '@app/errors/BaseError';

export default class ErrorFactory {

    public code?: string;
    public httpStatus: HttpResponseCode;
    public name: string;
    public message: string;

    constructor(err: BaseError) {
        this.code = err.code;
        this.httpStatus = err.httpStatus || HttpResponseCode.INTERNAL_SERVER_ERROR;
        this.name = err.name;
        // tslint:disable-next-line: no-commented-out-code
        // this.message = (this.httpStatus === ResponseCodesEnum.INTERNAL_SERVER_ERROR || err.message === undefined) ? 'There is an internal error' : this.message;
        this.message = err.message || 'There is an internal error';
    }
}
