"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpGetServiceIns = exports.HttpGetService = void 0;
const HttpMethodEnum_1 = require("@app/enums/HttpMethodEnum");
const HttpService_1 = require("./HttpService");
class HttpGetService extends HttpService_1.HttpService {
    constructor(url) {
        super(url, HttpMethodEnum_1.HttpMethodEnum.GET);
    }
}
exports.HttpGetService = HttpGetService;
exports.httpGetServiceIns = (url) => {
    return new HttpGetService(url);
};
//# sourceMappingURL=HttpGetService.js.map