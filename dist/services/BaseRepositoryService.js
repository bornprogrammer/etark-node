"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepositoryService = void 0;
const MethodCordinator_1 = __importDefault(require("@app/coordinators/method-cordinators/MethodCordinator"));
class BaseRepositoryService {
    constructor() {
    }
    getMethodCoordinator() {
        return new MethodCordinator_1.default();
    }
}
exports.BaseRepositoryService = BaseRepositoryService;
//# sourceMappingURL=BaseRepositoryService.js.map