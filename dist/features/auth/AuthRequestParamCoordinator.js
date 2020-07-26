"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRequestParamCoordinator = void 0;
const RequestParamsCoordinator_1 = __importDefault(require("@app/coordinators/request-params-cordinators/RequestParamsCoordinator"));
class AuthRequestParamCoordinator extends RequestParamsCoordinator_1.default {
    /**
     *
     */
    constructor(request) {
        super(request);
    }
    static getInstance(request) {
        return new AuthRequestParamCoordinator(request);
    }
    getLoginParams() {
        return this.setParamFromBody("phone_number").setParamFromBody("password").coordinate();
    }
    getCreateUserParams() {
        return this.setParamFromBody("phone_number").setParamFromBody("password").setParamFromBody("name").setParamFromBody("email").coordinate();
    }
}
exports.AuthRequestParamCoordinator = AuthRequestParamCoordinator;
//# sourceMappingURL=AuthRequestParamCoordinator.js.map