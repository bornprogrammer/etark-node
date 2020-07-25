"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RequestParamsCoordinator {
    constructor(request) {
        this.request = request;
        this.reqParamsContainer = {};
    }
    setParamFromBody(key) {
        this.reqParamsContainer[key] = this.request.body[key];
        return this;
    }
    setParamFromParams(key) {
        this.reqParamsContainer[key] = this.request.params[key];
        return this;
    }
    setParamFromQueryStr(key) {
        this.reqParamsContainer[key] = this.request.query[key];
        return this;
    }
    coordinate() {
        return this.reqParamsContainer;
    }
}
exports.default = RequestParamsCoordinator;
//# sourceMappingURL=RequestParamsCoordinator.js.map