"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("./../../features/auth/AuthController");
class AuthRoutes {
    static setRoutes() {
        let router = express_1.default.Router();
        router.post("/login", AuthController_1.authControllerIns.login);
        router.post("/", AuthController_1.authControllerIns.createUser);
        return router;
    }
}
exports.AuthRoutes = AuthRoutes;
//# sourceMappingURL=AuthRoutes.js.map