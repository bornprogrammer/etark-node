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
exports.masterControllerIns = exports.MasterController = void 0;
const BaseController_1 = require("@app/controllers/BaseController");
const MasterRequestParamCoordinator_1 = require("./MasterRequestParamCoordinator");
const MasterService_1 = require("./MasterService");
class MasterController extends BaseController_1.BaseController {
    /**
     *
     */
    constructor(masterService) {
        super();
        this.getMakerListByCategoryId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let params = MasterRequestParamCoordinator_1.MasterRequestParamCoordinator.getInstance(req).getMakerListByCategoryIdParams();
            yield this.getCtrlMethodCoordinator().setMethod({ callableFunction: this.mMasterService.getMakerListByCategoryId, callableFunctionParams: params }).send(req, res);
        });
        this.getMerchantList = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let params = MasterRequestParamCoordinator_1.MasterRequestParamCoordinator.getInstance(req).getMerchantListParams();
            yield this.getCtrlMethodCoordinator().setMethod({ callableFunction: this.mMasterService.getMerchantList, callableFunctionParams: params }).send(req, res);
        });
        this.getPlans = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.getCtrlMethodCoordinator().setMethod({ callableFunction: this.mMasterService.getPlans }).send(req, res);
        });
        this.getCities = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.getCtrlMethodCoordinator().setMethod({ callableFunction: this.mMasterService.getCities }).send(req, res);
        });
        this.addServiceCenter = (req, res) => __awaiter(this, void 0, void 0, function* () {
        });
        this.testApi = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.getCtrlMethodCoordinator().setMethod({ callableFunction: this.mMasterService.testApi }).send(req, res);
        });
        this.mMasterService = masterService;
    }
}
exports.MasterController = MasterController;
exports.masterControllerIns = new MasterController(MasterService_1.masterServiceIns);
//# sourceMappingURL=MasterController.js.map