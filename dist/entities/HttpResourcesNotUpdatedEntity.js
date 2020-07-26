"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpResponseEntity_1 = __importDefault(require("./HttpResponseEntity"));
const HttpResponseCodes_1 = require("@app/enums/HttpResponseCodes");
class HttpResourcesNotUpdatedEntity extends HttpResponseEntity_1.default {
    // public data: any;
    constructor(message) {
        super(message, HttpResponseCodes_1.HttpResponseCode.EXCEPTION_FAILED);
    }
}
exports.default = HttpResourcesNotUpdatedEntity;
//# sourceMappingURL=HttpResourcesNotUpdatedEntity.js.map