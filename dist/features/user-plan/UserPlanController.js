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
exports.userPlanControllerIns = exports.UserPlanController = void 0;
const BaseController_1 = require("@app/controllers/BaseController");
const UserPlanRepositoryService_1 = require("./UserPlanRepositoryService");
const UserPlanRequestParamCoordinator_1 = require("./UserPlanRequestParamCoordinator");
const ObjectHelper_1 = require("@app/helpers/ObjectHelper");
const AppConstants_1 = require("@app/constants/AppConstants");
class UserPlanController extends BaseController_1.BaseController {
    /**
     *
     */
    constructor() {
        super();
        this.addUserPlan = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let params = UserPlanRequestParamCoordinator_1.UserPlanRequestParamCoordinator.getInstance(req).getAddUsePlanParams();
            yield this.getCtrlMethodCoordinator().setMethod({ callableFunction: UserPlanRepositoryService_1.userPlanRepositoryServiceIns.addUserPlan, callableFunctionParams: params }).send(req, res);
        });
        this.makePayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let params = UserPlanRequestParamCoordinator_1.UserPlanRequestParamCoordinator.getInstance(req).getMakePaymentParams();
            yield this.getCtrlMethodCoordinator().setMethod({ callableFunction: UserPlanRepositoryService_1.userPlanRepositoryServiceIns.makePayment, callableFunctionParams: params }).send(req, res);
        });
        this.paytmCallback = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let params = { paytm_resp: req.body };
            let result = yield this.getCtrlMethodCoordinator().setMethod({ callableFunction: UserPlanRepositoryService_1.userPlanRepositoryServiceIns.paytmCallback, callableFunctionParams: params }).returnResp(req, res);
            const status = result ? params.paytm_resp.STATUS : "TXN_FAILURE";
            const queryStr = ObjectHelper_1.ObjectHelper.buildStrFromKeyNValueOfObject({ status, orderId: params.paytm_resp.ORDERID }, "=", "&");
            const urlToRedirect = AppConstants_1.AppConstants.CLIENT_URL_AFTER_PAYTM_RESPONSE + "#/confirm?" + queryStr;
            console.log("queryStr", urlToRedirect);
            res.redirect(urlToRedirect);
        });
    }
}
exports.UserPlanController = UserPlanController;
exports.userPlanControllerIns = new UserPlanController();
//# sourceMappingURL=UserPlanController.js.map