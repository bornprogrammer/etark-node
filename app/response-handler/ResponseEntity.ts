import { ResponseCodesEnum } from '../enums/ResponseCodesEnum';

export default class ResponseEntity {
    public message: string;
    public success: boolean;
    public httpStatus: ResponseCodesEnum;
    constructor(success: boolean, message: string, httpStatus: ResponseCodesEnum) {
        this.success = success;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
