import { HttpResponseError } from "./HttpResponseError";
import { HttpResponseCode } from "@app/enums/HttpResponseCodes";

export class UpdateUserPaymentStatusError extends HttpResponseError {

    /** 
     *
     */
    constructor() {
        super(HttpResponseCode.EXCEPTION_FAILED, "There is no order pending to be updated for paytm  payment callback");
    }
}