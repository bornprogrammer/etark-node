"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceCenterNotFound = void 0;
const HttpResponseError_1 = require("./HttpResponseError");
const HttpResponseCodes_1 = require("@app/enums/HttpResponseCodes");
class ServiceCenterNotFound extends HttpResponseError_1.HttpResponseError {
    constructor() {
        super(HttpResponseCodes_1.HttpResponseCode.RESOURCES_CREATED, "we are not serving at selected location");
    }
}
exports.ServiceCenterNotFound = ServiceCenterNotFound;
//# sourceMappingURL=ServiceCenterNotFound.js.map