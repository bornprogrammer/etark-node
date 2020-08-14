"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpResponseCodes_1 = require("@app/enums/HttpResponseCodes");
const HttpResponseError_1 = require("./HttpResponseError");
class UnAuthorized extends HttpResponseError_1.HttpResponseError {
    constructor() {
        super(HttpResponseCodes_1.HttpResponseCode.UNAUTHORIZED, "either username or password is wrong");
    }
}
exports.default = UnAuthorized;
//# sourceMappingURL=UnAuthorized.js.map