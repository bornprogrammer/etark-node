"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MethodCordinator_1 = __importDefault(require("@app/coordinators/method-cordinators/MethodCordinator"));
class BaseService {
    constructor() {
    }
    getMethodCoordinator() {
        return new MethodCordinator_1.default();
    }
}
exports.default = BaseService;
//# sourceMappingURL=BaseService.js.map