
import { HttpResponseCode } from "@app/enums/HttpResponseCodes";

export class HttpResponseError extends Error {

    public httpResponseCodes: HttpResponseCode;

    /**
     *
     */
    constructor(httpResponseCodes: HttpResponseCode, message: string) {
        super(message);
        this.httpResponseCodes = httpResponseCodes;
    }

}