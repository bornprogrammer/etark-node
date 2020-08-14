"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAlreadyExists = void 0;
const HttpResponseError_1 = require("./HttpResponseError");
const HttpResponseCodes_1 = require("@app/enums/HttpResponseCodes");
class UserAlreadyExists extends HttpResponseError_1.HttpResponseError {
    /**
     *
     */
    constructor() {
        super(HttpResponseCodes_1.HttpResponseCode.BAD_REQUEST, "User already exists");
    }
}
exports.UserAlreadyExists = UserAlreadyExists;
//# sourceMappingURL=UserAlreadyExists.js.map