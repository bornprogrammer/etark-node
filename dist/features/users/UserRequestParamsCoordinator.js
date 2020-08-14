"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRequestParamsCoordinator = void 0;
const RequestParamsCoordinator_1 = __importDefault(require("@app/coordinators/request-params-cordinators/RequestParamsCoordinator"));
class UserRequestParamsCoordinator extends RequestParamsCoordinator_1.default {
    /**
     *
     */
    constructor(req) {
        super(req);
        this.getAddAddressParams = () => {
            return this.setParamFromBody("address").setParamFromBody("zip_code").setParamFromParamsAs("id", "user_id").setParamFromBody("complain_id").setParamFromBody("city_id").setParamFromBody("lat").setParamFromBody("long").coordinate();
        };
        this.getSuccessPageDetailParams = () => {
            return this.setParamFromParamsAs("id", "user_id").setParamFromParams("order_id").coordinate();
        };
    }
}
exports.UserRequestParamsCoordinator = UserRequestParamsCoordinator;
UserRequestParamsCoordinator.getInstance = (req) => {
    return new UserRequestParamsCoordinator(req);
};
//# sourceMappingURL=UserRequestParamsCoordinator.js.map