"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthRoutes_1 = require("./auth/AuthRoutes");
const MasterRoutes_1 = require("./master/MasterRoutes");
const ComplaintRoutes_1 = require("./complaints/ComplaintRoutes");
const UserPlanRoutes_1 = require("./user-plans/UserPlanRoutes");
const UserRoutes_1 = require("./user/UserRoutes");
class AppRoutes {
    static routes() {
        const router = express_1.default.Router();
        router.use("/auth", AuthRoutes_1.AuthRoutes.setRoutes());
        router.use("/masters", MasterRoutes_1.MasterRoutes.setRoutes());
        router.use("/complaints", ComplaintRoutes_1.ComplaintRoutes.setRoutes());
        router.use("/user-plan", UserPlanRoutes_1.UserPlanRoutes.setRoutes());
        router.use("/users", UserRoutes_1.UserRoutes.setRoutes());
        return router;
    }
}
exports.default = AppRoutes;
//# sourceMappingURL=AppRoutes.js.map