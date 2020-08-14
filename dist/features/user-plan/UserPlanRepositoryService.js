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
exports.userPlanRepositoryServiceIns = exports.UserPlanRepositoryService = void 0;
const StoreResultAs_1 = require("@app/enums/StoreResultAs");
const PlanRepository_1 = require("@app/repositories/PlanRepository");
const GetUserPlanComponentDetailsParamsEntity_1 = require("@app/repo-method-param-entities/GetUserPlanComponentDetailsParamsEntity");
const GetPlanComponentDetailsParamsEntity_1 = require("@app/repo-method-param-entities/GetPlanComponentDetailsParamsEntity");
const UserPlanRepository_1 = require("@app/repositories/UserPlanRepository");
const UserPlanComponentRepository_1 = require("@app/repositories/UserPlanComponentRepository");
const UserPaymentRepository_1 = require("@app/repositories/UserPaymentRepository");
const PaytmService_1 = require("@app/services/PaytmService");
const AppConstants_1 = require("@app/constants/AppConstants");
const UserPaymentDetailsRepository_1 = require("@app/repositories/UserPaymentDetailsRepository");
const UserPaymentDetails_1 = require("@app/models/UserPaymentDetails");
const BaseRepositoryService_1 = require("@app/services/BaseRepositoryService");
const UserPlanService_1 = require("./UserPlanService");
const UpdateUserPaymentStatusError_1 = require("@app/errors/UpdateUserPaymentStatusError");
const AfterPaytmCallbackEventEmitter_1 = require("@app/events/AfterPaytmCallbackEventEmitter");
const EventEmitterIdentifierEnum_1 = require("@app/enums/EventEmitterIdentifierEnum");
const GetUserPlanStatusByUserPaymentIdParamsEntity_1 = require("@app/repo-method-param-entities/GetUserPlanStatusByUserPaymentIdParamsEntity");
class UserPlanRepositoryService extends BaseRepositoryService_1.BaseRepositoryService {
    /**
     *
     */
    constructor() {
        super();
        this.paytmCallback = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let result = yield this.getMethodCoordinator().setMethod({ callableFunction: this.updatePayment, callableFunctionParams: methodParamEntity.topMethodParam, resultToBeReturnedAsFinalResult: true }).setMethod({ callableFunction: this.updateUserPlanStatus }).setMethod({ callableFunction: this.afterPayment }).coordinate();
            return result;
        });
        this.updatePayment = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let topParams = methodParamEntity.topMethodParam.paytm_resp;
            topParams.orderId = UserPlanService_1.userPlanServiceIns.removeOrderPrefixFromOrderNo(topParams.ORDERID);
            let result = yield this.getMethodCoordinator().setMethod({ callableFunction: this.updatePaymentStatus, callableFunctionParams: topParams, resultToBeReturnedAsFinalResult: true }).setMethod({ callableFunction: this.createPaymentDetails }).coordinate();
            return result;
        });
        this.updatePaymentStatus = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let paytmResponse = methodParamEntity.topMethodParam;
            let userPayment = { paymentStatus: paytmResponse.STATUS === "TXN_SUCCESS" ? "completed" : "failed", orderId: paytmResponse.orderId };
            let result = yield UserPaymentRepository_1.userPaymentRepositoryIns.updateUserPaymentStatus(userPayment);
            if (result[0] !== 1) {
                throw new UpdateUserPaymentStatusError_1.UpdateUserPaymentStatusError();
            }
            return true;
        });
        /**
             *
             * @param methodParamEntity
             */
        this.createPaymentDetails = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let userPaymentDetails = new UserPaymentDetails_1.UserPaymentDetails();
            let paytmResp = methodParamEntity.topMethodParam;
            userPaymentDetails.id = paytmResp.orderId;
            userPaymentDetails.gateway_response = JSON.stringify(paytmResp);
            let result = yield UserPaymentDetailsRepository_1.userPaymentDetailsRepositoryIns.create(userPaymentDetails);
            return result;
        });
        this.updateUserPlanStatus = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam.paytm_resp;
            if (params.STATUS === "TXN_SUCCESS") {
                let result = yield this.getMethodCoordinator().setMethod({ callableFunction: this.getUserPlanDetailsByUserPaymentId, callableFunctionParams: params }).setMethod({ callableFunction: this.markUserPlanStatusSuccess }).coordinate();
                return result;
            }
            return false;
        });
        this.markUserPlanStatusSuccess = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.lastInvokedMethodParam;
            let result = yield UserPlanRepository_1.userPlanRepositoryIns.updateUserPlanStatus({ id: params.id, status: "success" });
            return result;
        });
        this.getUserPlanDetailsByUserPaymentId = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let orderId = UserPlanService_1.userPlanServiceIns.removeOrderPrefixFromOrderNo(params.ORDERID);
            let userPlanStatusByUserPaymentId = UserPlanRepository_1.userPlanRepositoryIns.getUserPlanStatusByUserPaymentId(new GetUserPlanStatusByUserPaymentIdParamsEntity_1.GetUserPlanStatusByUserPaymentIdParamsEntity(parseInt(orderId)));
            return userPlanStatusByUserPaymentId;
        });
        this.afterPayment = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let paytmResp = methodParamEntity.topMethodParam.paytm_resp;
            AfterPaytmCallbackEventEmitter_1.afterPaytmCallbackEventEmitterIns.emit(EventEmitterIdentifierEnum_1.EventEmitterIdentifierEnum.AFTER_PAYTM_CALLBACK_EVENTEMITTER, paytmResp);
        });
        this.sendEmail = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            // let params = methodParamEntity.topMethodParam;
            // console.log("sent email");
            // let orderId = params.paytm_resp.ORDERID.replace(AppConstants.ORDER_ID_PREFIX, "");
            // let orderId = userPlanServiceIns.removeOrderPrefixFromOrderNo(params.paytm_resp.ORDERID);
            // if (params.paytm_resp.STATUS === "TXN_SUCCESS") {
            // fileReaderServiceIns.readEmailTemplate("order-detail.html", this.sendOrderEmail.bind(null, result));
            // }
            // return params;
        });
        this.getDetailsForOrderEmailTemp = (orderId) => __awaiter(this, void 0, void 0, function* () {
            let result = yield UserPlanRepository_1.userPlanRepositoryIns.getDetailsForOrderEmailTemp(orderId);
            return result;
        });
        this.addUserPlan = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let result = yield this.getMethodCoordinator().setMethod({ callableFunction: this.getPlanDetails, callableFunctionParams: params, storeResultAs: StoreResultAs_1.StoreResultAs.PLAN_DETAILS }).setMethod({ callableFunction: this.addUserPlanDetails, storeResultAs: StoreResultAs_1.StoreResultAs.ADD_PLAN_RESULTS }).setMethod({ callableFunction: this.addUserPlanComponents }).coordinate();
            return result;
        });
        this.addUserPlanDetails = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let addUserPlan = { planId: params.plan_id, complainId: params.complain_id };
            let result = yield UserPlanRepository_1.userPlanRepositoryIns.create(addUserPlan);
            return result;
        });
        this.addUserPlanComponents = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let planComponentDetails = methodParamEntity.methodReturnedValContainer[StoreResultAs_1.StoreResultAs.PLAN_DETAILS];
            let userPlanObj = methodParamEntity.methodReturnedValContainer[StoreResultAs_1.StoreResultAs.ADD_PLAN_RESULTS];
            let addUserPlanComponentsParams = { planComponent: planComponentDetails.PlanComponents, userPlanId: userPlanObj.id };
            let result = yield UserPlanComponentRepository_1.userPlanComponentRepositoryIns.create(addUserPlanComponentsParams);
            return userPlanObj;
        });
        this.getPlanDetails = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let param = methodParamEntity.topMethodParam;
            let planComponentDetails = new GetPlanComponentDetailsParamsEntity_1.GetPlanComponentDetailsParamsEntity(param.plan_id);
            let result = yield PlanRepository_1.planRepositoryIns.getPlanComponentDetails(planComponentDetails);
            return result;
        });
        this.makePayment = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let result = yield this.getMethodCoordinator().setMethod({ callableFunction: this.getUserPlanComponentPriceDetails, callableFunctionParams: params }).setMethod({ callableFunction: this.createUserPayment }).setMethod({ callableFunction: this.generatePaytmTxnToken }).setMethod({ callableFunction: this.updateUserPayment }).coordinate();
            return result;
        });
        this.getUserPlanComponentPriceDetails = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.topMethodParam;
            let getUserPlanComponentDetailsParams = new GetUserPlanComponentDetailsParamsEntity_1.GetUserPlanComponentDetailsParamsEntity(params.user_plan_id);
            let result = yield UserPlanRepository_1.userPlanRepositoryIns.getUserPlanComponentPriceDetails(getUserPlanComponentDetailsParams);
            return result;
        });
        this.createUserPayment = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let userPlanComponentPriceDetails = methodParamEntity.lastInvokedMethodParam;
            let params = methodParamEntity.topMethodParam;
            let userPayment = { grand_total: userPlanComponentPriceDetails.grand_total, sub_total: userPlanComponentPriceDetails.sub_total, tax: userPlanComponentPriceDetails.tax, user_plan_id: params.user_plan_id, gateway_charge: userPlanComponentPriceDetails.gateway_charge };
            let result = yield UserPaymentRepository_1.userPaymentRepositoryIns.create(userPayment);
            return result;
        });
        this.generatePaytmTxnToken = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let userPaymentObject = methodParamEntity.lastInvokedMethodParam;
            let orderId = AppConstants_1.AppConstants.ORDER_ID_PREFIX + userPaymentObject.id;
            let paytmTxnTokenParams = { amount: userPaymentObject.grand_total, orderId, userId: userPaymentObject.id };
            let paytmVal = yield PaytmService_1.paytmServiceIns.generatePaytmTxnToken(paytmTxnTokenParams);
            paytmVal['user_payment'] = userPaymentObject;
            return paytmVal;
        });
        this.updateUserPayment = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let params = methodParamEntity.lastInvokedMethodParam;
            let userPaymentObject = params.user_payment;
            userPaymentObject.paytm_checksum = params.head.signature;
            userPaymentObject.order_no = AppConstants_1.AppConstants.ORDER_ID_PREFIX + userPaymentObject.id;
            UserPaymentRepository_1.userPaymentRepositoryIns.update(userPaymentObject);
            return params;
        });
    }
}
exports.UserPlanRepositoryService = UserPlanRepositoryService;
exports.userPlanRepositoryServiceIns = new UserPlanRepositoryService();
//# sourceMappingURL=UserPlanRepositoryService.js.map