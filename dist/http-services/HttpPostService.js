"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpPostServiceIns = void 0;
const HttpMethodEnum_1 = require("@app/enums/HttpMethodEnum");
const HttpService_1 = require("./HttpService");
class HttpPostService extends HttpService_1.HttpService {
    constructor(url) {
        super(url, HttpMethodEnum_1.HttpMethodEnum.POST);
    }
    setPayload(payload) {
        this.setHeaders('content-type', 'application/json');
        this.rpOptions.json = true;
        this.rpOptions.body = payload;
        return this;
    }
    setFormUrlEncodedPayload(payload) {
        this.setHeaders('content-type', 'application/x-www-form-urlencoded');
        this.rpOptions.form = payload;
        return this;
    }
}
exports.httpPostServiceIns = (url) => {
    return new HttpPostService(url);
};
//# sourceMappingURL=HttpPostService.js.map