"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRequestParamsCoordinator = void 0;
const RequestParamsCoordinator_1 = __importDefault(require("@app/coordinators/request-params-cordinators/RequestParamsCoordinator"));
class AuthRequestParamsCoordinator extends RequestParamsCoordinator_1.default {
    /**
     *
     */
    constructor(request) {
        super(request);
    }
    static getInstance(request) {
        return new AuthRequestParamsCoordinator(request);
    }
    getLoginParams() {
        return this.setParamFromBody("mobile_number").setParamFromBody("password").coordinate();
    }
    getCreateUserParams() {
        return this.setParamFromBody("mobile_number").setParamFromBody("password").setParamFromBody("name").setParamFromBody("email").coordinate();
    }
}
exports.AuthRequestParamsCoordinator = AuthRequestParamsCoordinator;
//# sourceMappingURL=AuthRequestParamsCoordinator.js.map