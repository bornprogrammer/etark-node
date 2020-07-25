import { HttpResponseCode } from "@app/enums/HttpResponseCodes";

export default class HttpResponseEntity {

    public message: string;

    public httpStatus: HttpResponseCode;

    public result: any;

    constructor(message: string, httpStatus: HttpResponseCode) {
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
