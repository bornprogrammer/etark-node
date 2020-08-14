"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServiceIns = exports.UserService = void 0;
const BaseService_1 = __importDefault(require("@app/services/BaseService"));
class UserService extends BaseService_1.default {
    /**
     *
     */
    constructor() {
        super();
    }
}
exports.UserService = UserService;
exports.userServiceIns = new UserService();
//# sourceMappingURL=UserService.js.map