"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserPaymentStatusError = void 0;
const HttpResponseError_1 = require("./HttpResponseError");
const HttpResponseCodes_1 = require("@app/enums/HttpResponseCodes");
class UpdateUserPaymentStatusError extends HttpResponseError_1.HttpResponseError {
    /**
     *
     */
    constructor() {
        super(HttpResponseCodes_1.HttpResponseCode.EXCEPTION_FAILED, "There is no order pending to be updated for paytm  payment callback");
    }
}
exports.UpdateUserPaymentStatusError = UpdateUserPaymentStatusError;
//# sourceMappingURL=UpdateUserPaymentStatusError.js.map