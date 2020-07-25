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
exports.authRepositoryIns = exports.AuthRepository = void 0;
const BaseRepository_1 = __importDefault(require("@app/services/BaseRepository"));
const User_1 = require("@app/models/User");
class AuthRepository extends BaseRepository_1.default {
    /**
     *
     */
    constructor() {
        super();
        this.isUserActive = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            console.log('came here');
            return methodParamEntity.topMethodParam;
        });
        this.createUser = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            console.log(params);
            let data = yield User_1.User.create(params);
            return data;
        });
    }
}
exports.AuthRepository = AuthRepository;
exports.authRepositoryIns = new AuthRepository();
//# sourceMappingURL=AuthRepository.js.map