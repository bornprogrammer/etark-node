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
const BaseRepository_1 = __importDefault(require("@app/repositories/BaseRepository"));
const User_1 = require("@app/models/User");
const sequelize_1 = require("sequelize");
const UserAlreadyExists_1 = require("@app/errors/UserAlreadyExists");
const UserStatusEnum_1 = require("@app/enums/UserStatusEnum");
const UserSuspended_1 = require("@app/errors/UserSuspended");
const UnAuthorized_1 = __importDefault(require("@app/errors/UnAuthorized"));
class AuthRepository extends BaseRepository_1.default {
    /**
     *
     */
    constructor() {
        super();
        this.loginUser = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            const params = methodParamEntity.topMethodParam;
            const result = yield User_1.User.findOne({
                where: {
                    mobile_number: params.mobile_number,
                    password: params.password
                }
            });
            if (!result) {
                throw new UnAuthorized_1.default();
            }
            else {
                if (result.status === UserStatusEnum_1.UserStatusEnum.SUSPENDED) {
                    throw new UserSuspended_1.UserSuspended();
                }
            }
            return result;
        });
        /**
         *
         * @param methodParamEntity
         */
        this.doesUserNotExist = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let count = yield User_1.User.count({
                where: {
                    [sequelize_1.Op.or]: [
                        {
                            mobile_number: params.mobile_number,
                            email: params.email
                        }
                    ]
                }
            });
            if (count > 0) {
                throw new UserAlreadyExists_1.UserAlreadyExists();
            }
            return true;
        });
        this.createUser = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let user = yield User_1.User.create(params);
            return user;
        });
    }
    create(params) {
        throw new Error("Method not implemented.");
    }
}
exports.AuthRepository = AuthRepository;
exports.authRepositoryIns = new AuthRepository();
//# sourceMappingURL=AuthRepository.js.map