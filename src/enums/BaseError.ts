import { ResponseCodesEnum } from '@app/enums/ResponseCodesEnum';

export default abstract class BaseError extends Error {
    public code?: string;
    public httpStatus: ResponseCodesEnum;
    public name: string;
    constructor(name: string, message: string, httpStatus?: ResponseCodesEnum, code?: string) {
        super(message);
        this.code = code;
        this.name = name;
        this.httpStatus = httpStatus;
    }
}
