"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPlanRequestParamCoordinator = void 0;
const RequestParamsCoordinator_1 = __importDefault(require("@app/coordinators/request-params-cordinators/RequestParamsCoordinator"));
class UserPlanRequestParamCoordinator extends RequestParamsCoordinator_1.default {
    /**
     *
     */
    constructor(req) {
        super(req);
        this.getAddUsePlanParams = () => {
            let params = this.setParamFromBody("complain_id").setParamFromBody("plan_id").coordinate();
            return params;
        };
        this.getMakePaymentParams = () => {
            let params = this.setParamFromParams("user_plan_id").coordinate();
            return params;
        };
    }
}
exports.UserPlanRequestParamCoordinator = UserPlanRequestParamCoordinator;
UserPlanRequestParamCoordinator.getInstance = (req) => {
    return new UserPlanRequestParamCoordinator(req);
};
//# sourceMappingURL=UserPlanRequestParamCoordinator.js.map