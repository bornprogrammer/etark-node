"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthRoutes_1 = require("./auth/AuthRoutes");
class AppRoutes {
    static routes() {
        const router = express_1.default.Router();
        router.use("/auth", AuthRoutes_1.AuthRoutes.setRoutes(router));
        return router;
    }
}
exports.default = AppRoutes;
//# sourceMappingURL=AppRoutes.js.map