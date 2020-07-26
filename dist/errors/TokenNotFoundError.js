"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenNotFoundError = void 0;
const HttpResponseCodes_1 = require("@app/enums/HttpResponseCodes");
const HttpResponseError_1 = require("./HttpResponseError");
class TokenNotFoundError extends HttpResponseError_1.HttpResponseError {
    constructor() {
        super(HttpResponseCodes_1.HttpResponseCode.UNAUTHORIZED, "token is invalid");
    }
}
exports.TokenNotFoundError = TokenNotFoundError;
//# sourceMappingURL=TokenNotFoundError.js.map