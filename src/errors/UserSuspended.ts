
import { HttpResponseError } from "./HttpResponseError";
import { HttpResponseCode } from "@app/enums/HttpResponseCodes";

export class UserSuspended extends HttpResponseError {

    /**
     *
     */
    constructor() {
        super(HttpResponseCode.BAD_REQUEST, "User is suspended");
    }

}