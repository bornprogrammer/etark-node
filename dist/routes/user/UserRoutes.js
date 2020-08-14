"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const UserController_1 = require("@app/features/users/UserController");
class UserRoutes {
}
exports.UserRoutes = UserRoutes;
UserRoutes.setRoutes = () => {
    let router = express_1.default.Router();
    router.post("/:id/addresses", UserController_1.userControllerIns.addAddress);
    router.get("/:id/payment/:order_id", UserController_1.userControllerIns.getSuccessPageDetail);
    return router;
};
//# sourceMappingURL=UserRoutes.js.map