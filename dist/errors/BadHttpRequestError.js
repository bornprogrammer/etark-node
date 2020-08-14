"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpResponseError_1 = require("./HttpResponseError");
const HttpResponseCodes_1 = require("@app/enums/HttpResponseCodes");
class BadHttpRequestError extends HttpResponseError_1.HttpResponseError {
    /**
     *
     */
    constructor() {
        super(HttpResponseCodes_1.HttpResponseCode.BAD_REQUEST, "There is bad request");
    }
}
exports.default = BadHttpRequestError;
//# sourceMappingURL=BadHttpRequestError.js.map