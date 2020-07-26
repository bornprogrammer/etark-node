"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpResponseError_1 = require("./HttpResponseError");
const HttpResponseCodes_1 = require("@app/enums/HttpResponseCodes");
class InternalError extends HttpResponseError_1.HttpResponseError {
    constructor() {
        super(HttpResponseCodes_1.HttpResponseCode.INTERNAL_SERVER_ERROR, "There is some internal error");
    }
}
exports.default = InternalError;
//# sourceMappingURL=InternalError.js.map