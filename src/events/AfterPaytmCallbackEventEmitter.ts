
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
import { BaseQueue } from "./BaseQueue";
import { PlanTypeEnums } from "@app/enums/PlanTypeEnums";
import { StoreResultAs } from "@app/enums/StoreResultAs";

export class AfterPaytmCallbackEventEmitter extends BaseQueue {
    /**
     *
     */
    constructor() {
        super(EventEmitterIdentifierEnum.AFTER_PAYTM_CALLBACK_EVENTEMITTER);
    }

    public async handleJob(data?: any) {
        await this.sendEmail(data);
    }

    public sendEmail = async (data: any) => {
        let paytmResp: PaytmCallbackResponseEntity = data;
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.isPaymentSucces, callableFunctionParams: paytmResp }).setMethod({ callableFunction: this.sendOrdeEmailToCustomer, notBreakWhenReturnedValueNotTruthy: true, storeResultAs: StoreResultAs.ORDER_DETAIL_FOR_EMAIL_TEMPLATE }).setMethod({ callableFunction: this.sendComplaintDetailEmailToServiceCenter }).coordinate();
    }

    public sendOrdeEmailToCustomer = async (methodParamEntity: MethodParamEntity) => {
        let paytmResp = methodParamEntity.topMethodParam;
        let result = await userPlanRepositoryServiceIns.getDetailsForOrderEmailTemp(userPlanServiceIns.removeOrderPrefixFromOrderNo(paytmResp.ORDERID));
        if (result) {
            fileReaderServiceIns.readEmailTemplate("order-detail.html", this.sendOrderEmail.bind(null, result));
        }
        return result;
    }

    public sendComplaintDetailEmailToServiceCenter = async (methodParamEntity: MethodParamEntity) => {
        let paytmResp = methodParamEntity.topMethodParam;
        let orderDetail = methodParamEntity.methodReturnedValContainer[StoreResultAs.ORDER_DETAIL_FOR_EMAIL_TEMPLATE];
        if (this.isPlanPremiumPlan(orderDetail[0])) {
            let orderId = userPlanServiceIns.removeOrderPrefixFromOrderNo(paytmResp.ORDERID);
            let serviceCenterCompensationEmailDetails = await complaintServiceIns.getComplainDetailsForServiceCenterEmail(parseInt(orderId));
            if (serviceCenterCompensationEmailDetails) {
                fileReaderServiceIns.readEmailTemplate("Email-template-etark.html", this.sendCompensationEmailToServiceCenter.bind(null, serviceCenterCompensationEmailDetails));
            }
        }
    }

    public sendCompensationEmailToServiceCenter = async (sellerCompensationEmailEntity: SellerCompensationEmailEntity, error, data) => {
        nodeMailerServiceIns.sendHtml(config.get("mail.from"), "iamabornprogrammer@gmail.com", "Request for compensationOrder email", UtilsHelper.replaceAllStr(sellerCompensationEmailEntity, data));
    }

    public sendOrderEmail = async (orderDetail, error, data) => {
        console.log("orderDetail", orderDetail);
        let orderDetailObj = orderDetail[0];
        orderDetailObj.is_download_report_to_be_shown = await this.isDownloadReportToBeShown(orderDetailObj) ? "inline-block" : "none";
        orderDetailObj.email = "iamabornprogrammer@gmail.com";
        nodeMailerServiceIns.sendHtml(config.get("mail.from"), orderDetailObj.email, "Order email", UtilsHelper.replaceAllStr(orderDetailObj, data));
    }

    public isPaymentSucces = (methodParamEntity: MethodParamEntity): boolean => {
        let paytmResp: any = methodParamEntity.topMethodParam;
        return paytmResp.STATUS === "TXN_SUCCESS";
    }

    public isDownloadReportToBeShown = async (orderDetailObj: any): Promise<boolean> => {
        let isDownloadReportToBeShown = true;
        let planType = orderDetailObj.plan_type;
        if (planType === PlanTypeEnums.PLAN_TYPE_PICKUP_DELIVERY) {
            isDownloadReportToBeShown = false;
        }
        return isDownloadReportToBeShown;
    }

    public isPlanPremiumPlan = (orderDetailObj: any): boolean => {
        let isPlanPremiumPlan = false;
        let planType = orderDetailObj.plan_type;
        if (planType === PlanTypeEnums.PLAN_TYPE_PREMIUM || planType === PlanTypeEnums.PLAN_TYPE_PREMIUM_WITH_PICKUP_DELIVERY) {
            isPlanPremiumPlan = true;
        }
        return isPlanPremiumPlan;
    }
}

export const afterPaytmCallbackEventEmitterIns = new AfterPaytmCallbackEventEmitter();