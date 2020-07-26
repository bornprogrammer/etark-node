"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResponseCode = void 0;
var HttpResponseCode;
(function (HttpResponseCode) {
    HttpResponseCode[HttpResponseCode["SUCCESS"] = 200] = "SUCCESS";
    HttpResponseCode[HttpResponseCode["RESOURCES_CREATED"] = 201] = "RESOURCES_CREATED";
    HttpResponseCode[HttpResponseCode["NO_CONTENT"] = 204] = "NO_CONTENT";
    HttpResponseCode[HttpResponseCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpResponseCode[HttpResponseCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpResponseCode[HttpResponseCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpResponseCode[HttpResponseCode["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
    HttpResponseCode[HttpResponseCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    HttpResponseCode[HttpResponseCode["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
    HttpResponseCode[HttpResponseCode["CONFLICT"] = 409] = "CONFLICT";
    HttpResponseCode[HttpResponseCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpResponseCode[HttpResponseCode["EXCEPTION_FAILED"] = 417] = "EXCEPTION_FAILED";
})(HttpResponseCode = exports.HttpResponseCode || (exports.HttpResponseCode = {}));
//# sourceMappingURL=HttpResponseCodes.js.map