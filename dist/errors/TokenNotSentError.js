"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenNotSentError = void 0;
const HttpResponseCodes_1 = require("@app/enums/HttpResponseCodes");
const HttpResponseError_1 = require("./HttpResponseError");
class TokenNotSentError extends HttpResponseError_1.HttpResponseError {
    constructor() {
        super(HttpResponseCodes_1.HttpResponseCode.BAD_REQUEST, "token is not sent");
    }
}
exports.TokenNotSentError = TokenNotSentError;
//# sourceMappingURL=TokenNotSentError.js.map