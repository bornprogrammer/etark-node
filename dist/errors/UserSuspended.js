"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSuspended = void 0;
const HttpResponseError_1 = require("./HttpResponseError");
const HttpResponseCodes_1 = require("@app/enums/HttpResponseCodes");
class UserSuspended extends HttpResponseError_1.HttpResponseError {
    /**
     *
     */
    constructor() {
        super(HttpResponseCodes_1.HttpResponseCode.BAD_REQUEST, "User is suspended");
    }
}
exports.UserSuspended = UserSuspended;
//# sourceMappingURL=UserSuspended.js.map