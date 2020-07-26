"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseServiceIns = void 0;
const UtilsHelper_1 = require("@app/helpers/UtilsHelper");
const HttpResponseFoundEntity_1 = __importDefault(require("@app/entities/HttpResponseFoundEntity"));
const HttpResourcesUpdatedEntity_1 = __importDefault(require("@app/entities/HttpResourcesUpdatedEntity"));
const HttpResponseNotFoundEntity_1 = __importDefault(require("@app/entities/HttpResponseNotFoundEntity"));
const HttpResourcesNotUpdatedEntity_1 = __importDefault(require("@app/entities/HttpResourcesNotUpdatedEntity"));
const HttpResponseEntity_1 = __importDefault(require("@app/entities/HttpResponseEntity"));
/**
 * would be instantiated by app utility middleware
 */
class ResponseService {
    /**
     * would be used to send the response when either resource found or not found
     * @param data
     */
    sendResponse(req, response, data) {
        let responseEntity = null;
        if (UtilsHelper_1.UtilsHelper.isMethodReturnedValueTruthy(data)) {
            if (req.method.toLowerCase() === 'get') {
                responseEntity = new HttpResponseFoundEntity_1.default(data, "succes");
            }
            else {
                responseEntity = new HttpResourcesUpdatedEntity_1.default(data, "resources updated");
            }
        }
        else {
            // const message = langHelperIns.getFailedMessage(req);
            if (req.method.toLowerCase() === 'get') {
                responseEntity = new HttpResponseNotFoundEntity_1.default("no response found");
            }
            else {
                responseEntity = new HttpResourcesNotUpdatedEntity_1.default("there is an error while updating");
            }
        }
        this.send(response, responseEntity);
    }
    /**
     * would be used to send response in case of any kind of error
     * @param errorExp
     */
    sendErrorResponse(response, errorExp) {
        const errorEntity = new HttpResponseEntity_1.default(errorExp.message, errorExp.httpResponseCodes);
        this.send(response, errorEntity);
    }
    send(response, httpResponseEntity) {
        response.status(httpResponseEntity.httpStatus).send(httpResponseEntity);
    }
}
exports.default = ResponseService;
exports.responseServiceIns = new ResponseService();
//# sourceMappingURL=ResponseService.js.map