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
const BaseEventEmitter_1 = require("./BaseEventEmitter");
const EventEmitterIdentifierEnum_1 = require("@app/enums/EventEmitterIdentifierEnum");
const UserPlanService_1 = require("@app/features/user-plan/UserPlanService");
const UserPlanRepositoryService_1 = require("@app/features/user-plan/UserPlanRepositoryService");
const FileReaderService_1 = require("@app/services/FileReaderService");
const NodeMailerService_1 = require("@app/services/NodeMailerService");
const UtilsHelper_1 = require("@app/helpers/UtilsHelper");
const config_1 = __importDefault(require("config"));
const ComplaintService_1 = require("@app/features/complaints/ComplaintService");
class AfterPaytmCallbackEventEmitter extends BaseEventEmitter_1.BaseEventEmitter {
    /**
     *
     */
    constructor() {
        super(EventEmitterIdentifierEnum_1.EventEmitterIdentifierEnum.AFTER_PAYTM_CALLBACK_EVENTEMITTER);
        this.sendEmail = (data) => __awaiter(this, void 0, void 0, function* () {
            let paytmResp = data;
            let result = yield this.getMethodCoordinator().setMethod({ callableFunction: this.isPaymentSucces, callableFunctionParams: paytmResp }).setMethod({ callableFunction: this.sendOrdeEmailToCustomer, notBreakWhenReturnedValueNotTruthy: true }).setMethod({ callableFunction: this.sendComplaintDetailEmailToServiceCenter }).coordinate();
        });
        this.sendOrdeEmailToCustomer = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let paytmResp = methodParamEntity.topMethodParam;
            let result = yield UserPlanRepositoryService_1.userPlanRepositoryServiceIns.getDetailsForOrderEmailTemp(UserPlanService_1.userPlanServiceIns.removeOrderPrefixFromOrderNo(paytmResp.ORDERID));
            if (result) {
                FileReaderService_1.fileReaderServiceIns.readEmailTemplate("order-detail.html", this.sendOrderEmail.bind(null, result));
            }
        });
        this.sendComplaintDetailEmailToServiceCenter = (methodParamEntity) => __awaiter(this, void 0, void 0, function* () {
            let paytmResp = methodParamEntity.topMethodParam;
            let orderId = UserPlanService_1.userPlanServiceIns.removeOrderPrefixFromOrderNo(paytmResp.ORDERID);
            let serviceCenterCompensationEmailDetails = yield ComplaintService_1.complaintServiceIns.getComplainDetailsForServiceCenterEmail(parseInt(orderId));
            if (serviceCenterCompensationEmailDetails) {
                FileReaderService_1.fileReaderServiceIns.readEmailTemplate("Email-template-etark.html", this.sendCompensationEmailToServiceCenter.bind(null, serviceCenterCompensationEmailDetails));
            }
        });
        this.sendCompensationEmailToServiceCenter = (sellerCompensationEmailEntity, error, data) => {
            NodeMailerService_1.nodeMailerServiceIns.sendHtml(config_1.default.get("mail.from"), "iamabornprogrammer@gmail.com", "Request for compensationOrder email", UtilsHelper_1.UtilsHelper.replaceAllStr(sellerCompensationEmailEntity, data));
        };
        this.sendOrderEmail = (orderDetail, error, data) => {
            let orderDetailObj = orderDetail[0];
            orderDetailObj.is_download_report_to_be_shown = this.isDownloadReportToBeShown(orderDetailObj) ? "inline-block" : "none";
            orderDetailObj.email = "iamabornprogrammer@gmail.com";
            NodeMailerService_1.nodeMailerServiceIns.sendHtml(config_1.default.get("mail.from"), orderDetailObj.email, "Order email", UtilsHelper_1.UtilsHelper.replaceAllStr(orderDetailObj, data));
        };
        this.isPaymentSucces = (methodParamEntity) => {
            let paytmResp = methodParamEntity.topMethodParam;
            return paytmResp.STATUS === "TXN_SUCCESS";
        };
        this.isDownloadReportToBeShown = (orderDetailObj) => {
            let isDownloadReportToBeShown = true;
            let planType = orderDetailObj.plan_type;
            if (planType === "pickup_delivery") {
                isDownloadReportToBeShown = false;
            }
            return isDownloadReportToBeShown;
        };
    }
    handle(data) {
        this.sendEmail(data);
    }
}
exports.AfterPaytmCallbackEventEmitter = AfterPaytmCallbackEventEmitter;
exports.afterPaytmCallbackEventEmitterIns = new AfterPaytmCallbackEventEmitter();
//# sourceMappingURL=AfterPaytmCallbackEventEmitter.js.map