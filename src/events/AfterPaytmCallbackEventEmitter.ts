import { BaseEventEmitter } from "./BaseEventEmitter";
import { EventEmitterIdentifierEnum } from "@app/enums/EventEmitterIdentifierEnum";
import { PaytmCallbackResponseEntity } from "@app/entities/PaytmCallbackResponseEntity";
import { userPlanServiceIns } from "@app/features/user-plan/UserPlanService";
import { userPlanRepositoryServiceIns } from "@app/features/user-plan/UserPlanRepositoryService";
import { fileReaderServiceIns } from "@app/services/FileReaderService";
import { nodeMailerServiceIns } from "@app/services/NodeMailerService";
import { UtilsHelper } from "@app/helpers/UtilsHelper";
import config from "config";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { complaintServiceIns } from "@app/features/complaints/ComplaintService";
import { SellerCompensationEmailEntity } from "@app/entities/SellerCompensationEmailEntity";

export class AfterPaytmCallbackEventEmitter extends BaseEventEmitter {
    /**
     *
     */
    constructor() {
        super(EventEmitterIdentifierEnum.AFTER_PAYTM_CALLBACK_EVENTEMITTER);
    }

    public handle(data?: any) {
        this.sendEmail(data);
    }

    public sendEmail = async (data: any) => {
        let paytmResp: PaytmCallbackResponseEntity = data;
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.isPaymentSucces, callableFunctionParams: paytmResp }).setMethod({ callableFunction: this.sendOrdeEmailToCustomer, notBreakWhenReturnedValueNotTruthy: true }).setMethod({ callableFunction: this.sendComplaintDetailEmailToServiceCenter }).coordinate();
    }

    public sendOrdeEmailToCustomer = async (methodParamEntity: MethodParamEntity) => {
        let paytmResp = methodParamEntity.topMethodParam;
        let result = await userPlanRepositoryServiceIns.getDetailsForOrderEmailTemp(userPlanServiceIns.removeOrderPrefixFromOrderNo(paytmResp.ORDERID));
        if (result) {
            fileReaderServiceIns.readEmailTemplate("order-detail.html", this.sendOrderEmail.bind(null, result));
        }
    }

    public sendComplaintDetailEmailToServiceCenter = async (methodParamEntity: MethodParamEntity) => {
        let paytmResp = methodParamEntity.topMethodParam;
        let orderId = userPlanServiceIns.removeOrderPrefixFromOrderNo(paytmResp.ORDERID);
        let serviceCenterCompensationEmailDetails = await complaintServiceIns.getComplainDetailsForServiceCenterEmail(parseInt(orderId));
        if (serviceCenterCompensationEmailDetails) {
            fileReaderServiceIns.readEmailTemplate("Email-template-etark.html", this.sendCompensationEmailToServiceCenter.bind(null, serviceCenterCompensationEmailDetails));
        }
    }

    public sendCompensationEmailToServiceCenter = (sellerCompensationEmailEntity: SellerCompensationEmailEntity, error, data) => {
        nodeMailerServiceIns.sendHtml(config.get("mail.from"), "iamabornprogrammer@gmail.com", "Request for compensationOrder email", UtilsHelper.replaceAllStr(sellerCompensationEmailEntity, data));
    }

    public sendOrderEmail = (orderDetail, error, data) => {
        let orderDetailObj = orderDetail[0];
        orderDetailObj.is_download_report_to_be_shown = this.isDownloadReportToBeShown(orderDetailObj) ? "inline-block" : "none";
        orderDetailObj.email = "iamabornprogrammer@gmail.com";
        nodeMailerServiceIns.sendHtml(config.get("mail.from"), orderDetailObj.email, "Order email", UtilsHelper.replaceAllStr(orderDetailObj, data));
    }

    public isPaymentSucces = (methodParamEntity: MethodParamEntity): boolean => {
        let paytmResp: any = methodParamEntity.topMethodParam;
        return paytmResp.STATUS === "TXN_SUCCESS";
    }

    public isDownloadReportToBeShown = (orderDetailObj: any): boolean => {
        let isDownloadReportToBeShown = true;
        let planType = orderDetailObj.plan_type;
        if (planType === "pickup_delivery") {
            isDownloadReportToBeShown = false;
        }
        return isDownloadReportToBeShown;
    }
}

export const afterPaytmCallbackEventEmitterIns = new AfterPaytmCallbackEventEmitter();