
import { HttpResponseError } from "./HttpResponseError";

import { HttpResponseCode } from "@app/enums/HttpResponseCodes";

export default class InternalError extends HttpResponseError {

    constructor() {
        super(HttpResponseCode.INTERNAL_SERVER_ERROR, "There is some internal error");
    }
}
