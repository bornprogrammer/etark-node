"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPlanServiceIns = exports.UserPlanService = void 0;
const BaseService_1 = __importDefault(require("@app/services/BaseService"));
const AppConstants_1 = require("@app/constants/AppConstants");
class UserPlanService extends BaseService_1.default {
    /**
     *
     */
    constructor() {
        super();
    }
    removeOrderPrefixFromOrderNo(orderNo) {
        if (orderNo) {
            return orderNo.replace(AppConstants_1.AppConstants.ORDER_ID_PREFIX, "");
        }
        return null;
    }
}
exports.UserPlanService = UserPlanService;
exports.userPlanServiceIns = new UserPlanService();
//# sourceMappingURL=UserPlanService.js.map