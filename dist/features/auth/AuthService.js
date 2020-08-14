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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServiceIns = exports.AuthService = void 0;
const BaseService_1 = __importDefault(require("@app/services/BaseService"));
const AuthRepository_1 = require("./AuthRepository");
class AuthService extends BaseService_1.default {
    /**
     *
     */
    constructor(authRepository) {
        super();
        this.login = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let result = yield this.getMethodCoordinator().setMethod({ callableFunction: this.mAuthRepository.loginUser, callableFunctionParams: methodParamEntity.topMethodParam }).coordinate();
            return result;
        });
        this.createUser = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getMethodCoordinator().setMethod({ callableFunction: this.mAuthRepository.doesUserNotExist, callableFunctionParams: methodParamEntity.topMethodParam }).setMethod({ callableFunction: this.mAuthRepository.createUser }).coordinate();
            return result;
        });
        this.mAuthRepository = authRepository;
    }
}
exports.AuthService = AuthService;
exports.authServiceIns = new AuthService(AuthRepository_1.authRepositoryIns);
//# sourceMappingURL=AuthService.js.map