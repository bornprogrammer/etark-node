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
exports.afterPaytmCallbackEventEmitterIns = exports.AfterPaytmCallbackEventEmitter = void 0;
const EventEmitterIdentifierEnum_1 = require("@app/enums/EventEmitterIdentifierEnum");
const UserPlanService_1 = require("@app/features/user-plan/UserPlanService");
const UserPlanRepositoryService_1 = require("@app/features/user-plan/UserPlanRepositoryService");
const FileReaderService_1 = require("@app/services/FileReaderService");
const NodeMailerService_1 = require("@app/services/NodeMailerService");
const UtilsHelper_1 = require("@app/helpers/UtilsHelper");
const config_1 = __importDefault(require("config"));
const ComplaintService_1 = require("@app/features/complaints/ComplaintService");
const BaseQueue_1 = require("./BaseQueue");
const PlanTypeEnums_1 = require("@app/enums/PlanTypeEnums");
const StoreResultAs_1 = require("@app/enums/StoreResultAs");
class AfterPaytmCallbackEventEmitter extends BaseQueue_1.BaseQueue {
    /**
     *
     */
    constructor() {
        super(EventEmitterIdentifierEnum_1.EventEmitterIdentifierEnum.AFTER_PAYTM_CALLBACK_EVENTEMITTER);
        this.sendEmail = (data) => __awaiter(this, void 0, void 0, function* () {
            let paytmResp = data;
            let result = yield this.getMethodCoordinator().setMethod({ callableFunction: this.isPaymentSucces, callableFunctionParams: paytmResp }).setMethod({ callableFunction: this.sendOrdeEmailToCustomer, notBreakWhenReturnedValueNotTruthy: true, storeResultAs: StoreResultAs_1.StoreResultAs.ORDER_DETAIL_FOR_EMAIL_TEMPLATE }).setMethod({ callableFunction: this.sendComplaintDetailEmailToServiceCenter }).coordinate();
        });
        this.sendOrdeEmailToCustomer = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let paytmResp = methodParamEntity.topMethodParam;
            let result = yield UserPlanRepositoryService_1.userPlanRepositoryServiceIns.getDetailsForOrderEmailTemp(UserPlanService_1.userPlanServiceIns.removeOrderPrefixFromOrderNo(paytmResp.ORDERID));
            if (result) {
                FileReaderService_1.fileReaderServiceIns.readEmailTemplate("order-detail.html", this.sendOrderEmail.bind(null, result));
            }
            return result;
        });
        this.sendComplaintDetailEmailToServiceCenter = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let paytmResp = methodParamEntity.topMethodParam;
            let orderDetail = methodParamEntity.methodReturnedValContainer[StoreResultAs_1.StoreResultAs.ORDER_DETAIL_FOR_EMAIL_TEMPLATE];
            if (this.isPlanPremiumPlan(orderDetail[0])) {
                let orderId = UserPlanService_1.userPlanServiceIns.removeOrderPrefixFromOrderNo(paytmResp.ORDERID);
                let serviceCenterCompensationEmailDetails = yield ComplaintService_1.complaintServiceIns.getComplainDetailsForServiceCenterEmail(parseInt(orderId));
                if (serviceCenterCompensationEmailDetails) {
                    FileReaderService_1.fileReaderServiceIns.readEmailTemplate("Email-template-etark.html", this.sendCompensationEmailToServiceCenter.bind(null, serviceCenterCompensationEmailDetails));
                }
            }
        });
        this.sendCompensationEmailToServiceCenter = (sellerCompensationEmailEntity, error, data) => __awaiter(this, void 0, void 0, function* () {
            NodeMailerService_1.nodeMailerServiceIns.sendHtml(config_1.default.get("mail.from"), "bapi.rahul@gmail.com", "Request for compensationOrder email", UtilsHelper_1.UtilsHelper.replaceAllStr(sellerCompensationEmailEntity, data));
        });
        this.sendOrderEmail = (orderDetail, error, data) => __awaiter(this, void 0, void 0, function* () {
            console.log("orderDetail", orderDetail);
            let orderDetailObj = orderDetail[0];
            orderDetailObj.is_download_report_to_be_shown = (yield this.isDownloadReportToBeShown(orderDetailObj)) ? "inline-block" : "none";
            // orderDetailObj.email = "iamabornprogrammer@gmail.com";
            NodeMailerService_1.nodeMailerServiceIns.sendHtml(config_1.default.get("mail.from"), orderDetailObj.email, "Order email", UtilsHelper_1.UtilsHelper.replaceAllStr(orderDetailObj, data));
        });
        this.isPaymentSucces = (methodParamEntity) => {
            let paytmResp = methodParamEntity.topMethodParam;
            return paytmResp.STATUS === "TXN_SUCCESS";
        };
        this.isDownloadReportToBeShown = (orderDetailObj) => __awaiter(this, void 0, void 0, function* () {
            let isDownloadReportToBeShown = true;
            let planType = orderDetailObj.plan_type;
            if (planType === PlanTypeEnums_1.PlanTypeEnums.PLAN_TYPE_PICKUP_DELIVERY) {
                isDownloadReportToBeShown = false;
            }
            return isDownloadReportToBeShown;
        });
        this.isPlanPremiumPlan = (orderDetailObj) => {
            let isPlanPremiumPlan = false;
            let planType = orderDetailObj.plan_type;
            if (planType === PlanTypeEnums_1.PlanTypeEnums.PLAN_TYPE_PREMIUM || planType === PlanTypeEnums_1.PlanTypeEnums.PLAN_TYPE_PREMIUM_WITH_PICKUP_DELIVERY) {
                isPlanPremiumPlan = true;
            }
            return isPlanPremiumPlan;
        };
    }
    handleJob(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendEmail(data);
        });
    }
}
exports.AfterPaytmCallbackEventEmitter = AfterPaytmCallbackEventEmitter;
exports.afterPaytmCallbackEventEmitterIns = new AfterPaytmCallbackEventEmitter();
//# sourceMappingURL=AfterPaytmCallbackEventEmitter.js.map