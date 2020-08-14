"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authControllerIns = void 0;
const BaseController_1 = require("./../../controllers/BaseController");
const AuthService_1 = require("./AuthService");
const AuthRequestParamsCoordinator_1 = require("./AuthRequestParamsCoordinator");
class AuthController extends BaseController_1.BaseController {
    /**
     *
     */
    constructor(authService) {
        super();
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let params = AuthRequestParamsCoordinator_1.AuthRequestParamsCoordinator.getInstance(req).getLoginParams();
            this.getCtrlMethodCoordinator().setMethod({ callableFunction: this.mService.login, callableFunctionParams: params }).send(req, res);
        });
        this.createUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let params = AuthRequestParamsCoordinator_1.AuthRequestParamsCoordinator.getInstance(req).getCreateUserParams();
            this.getCtrlMethodCoordinator().setMethod({ callableFunction: this.mService.createUser, callableFunctionParams: params }).send(req, res);
        });
        this.mService = authService;
    }
}
exports.authControllerIns = new AuthController(AuthService_1.authServiceIns);
//# sourceMappingURL=AuthController.js.map