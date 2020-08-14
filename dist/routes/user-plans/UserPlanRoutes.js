"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPlanRoutes = void 0;
const express_1 = __importDefault(require("express"));
const UserPlanController_1 = require("@app/features/user-plan/UserPlanController");
class UserPlanRoutes {
    static setRoutes() {
        let router = express_1.default.Router();
        router.post("/", UserPlanController_1.userPlanControllerIns.addUserPlan);
        router.post("/:user_plan_id/pay", UserPlanController_1.userPlanControllerIns.makePayment);
        router.post("/paytm-callback", UserPlanController_1.userPlanControllerIns.paytmCallback);
        return router;
    }
}
exports.UserPlanRoutes = UserPlanRoutes;
//# sourceMappingURL=UserPlanRoutes.js.map