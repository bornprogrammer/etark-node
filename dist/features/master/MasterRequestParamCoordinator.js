"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterRequestParamCoordinator = void 0;
const RequestParamsCoordinator_1 = __importDefault(require("@app/coordinators/request-params-cordinators/RequestParamsCoordinator"));
class MasterRequestParamCoordinator extends RequestParamsCoordinator_1.default {
    /**
     *
     */
    constructor(request) {
        super(request);
    }
    static getInstance(request) {
        return new MasterRequestParamCoordinator(request);
    }
    getMakerListByCategoryIdParams() {
        return this.setParamFromParams("id").coordinate();
    }
    getMerchantListParams() {
        return this.setParamFromParams("type").coordinate();
    }
}
exports.MasterRequestParamCoordinator = MasterRequestParamCoordinator;
//# sourceMappingURL=MasterRequestParamCoordinator.js.map