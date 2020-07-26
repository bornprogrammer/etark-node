"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResponseError = void 0;
class HttpResponseError extends Error {
    /**
     *
     */
    constructor(httpResponseCodes, message) {
        super(message);
        this.httpResponseCodes = httpResponseCodes;
    }
}
exports.HttpResponseError = HttpResponseError;
//# sourceMappingURL=HttpResponseError.js.map