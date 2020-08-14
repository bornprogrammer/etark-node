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
exports.masterServiceIns = exports.MasterService = void 0;
const BaseService_1 = __importDefault(require("@app/services/BaseService"));
const MasterRepository_1 = require("./MasterRepository");
class MasterService extends BaseService_1.default {
    /**
     *
     */
    constructor(masterRepository) {
        super();
        this.getMakerListByCategoryId = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let result = yield this.getMethodCoordinator().setMethod({ callableFunction: this.mMasterRepository.getMakerListByCategoryId, callableFunctionParams: params }).coordinate();
            return result;
        });
        this.getMerchantList = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let result = yield this.getMethodCoordinator().setMethod({ callableFunction: this.mMasterRepository.getMerchantList, callableFunctionParams: params }).coordinate();
            return result;
        });
        this.getPlans = () => __awaiter(this, void 0, void 0, function* () {
            let result = yield this.getMethodCoordinator().setMethod({ callableFunction: this.mMasterRepository.getPlans }).coordinate();
            return result;
        });
        this.getCities = () => __awaiter(this, void 0, void 0, function* () {
            let result = yield this.getMethodCoordinator().setMethod({ callableFunction: this.mMasterRepository.getCities }).coordinate();
            return result;
        });
        this.testApi = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let origins = [{ lat: "28.412932", long: "77.033878" }];
            let dests = [{ lat: "28.453729", long: "77.039494" }, { lat: "28.510637", long: "77.048866" }, { lat: "28.471032", long: "77.049519" }];
            // let result = await googleDistanceMapApiServiceIns.getMinDistance(origins, dests);
            return true;
        });
        this.mMasterRepository = masterRepository;
    }
}
exports.MasterService = MasterService;
exports.masterServiceIns = new MasterService(MasterRepository_1.masterRepositoryIns);
//# sourceMappingURL=MasterService.js.map