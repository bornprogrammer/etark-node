"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const AuthController_1 = require("./../../features/auth/AuthController");
class AuthRoutes {
    static setRoutes(router) {
        router.post("/login", AuthController_1.authControllerIns.login);
        router.post("/", AuthController_1.authControllerIns.login);
        return router;
    }
}
exports.AuthRoutes = AuthRoutes;
//# sourceMappingURL=AuthRoutes.js.map