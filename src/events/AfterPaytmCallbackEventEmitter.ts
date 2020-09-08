
import { EventEmitterIdentifierEnum } from "@app/enums/EventEmitterIdentifierEnum";
import { PaytmCallbackResponseEntity } from "@app/entities/PaytmCallbackResponseEntity";
import { userPlanServiceIns } from "@app/features/user-plan/UserPlanService";
import { userPlanRepositoryServiceIns } from "@app/features/user-plan/UserPlanRepositoryService";
import { fileReaderServiceIns } from "@app/services/FileReaderService";
import { nodeMailerServiceIns } from "@app/services/NodeMailerService";
import { UtilsHelper } from "@app/helpers/UtilsHelper";
import config from "config";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { complaintServiceIns } from "@app/features/complaints/ComplaintRepositoryService";
import { SellerCompensationEmailEntity } from "@app/entities/SellerCompensationEmailEntity";
import { BaseQueue } from "./BaseQueue";
import { PlanTypeEnums } from "@app/enums/PlanTypeEnums";
import { StoreResultAs } from "@app/enums/StoreResultAs";
import { complaintRepositoryIns } from "@app/repositories/ComplaintRepository";
import { htmlToPDFConverterIns } from "@app/services/HTMLToPDFConverter";
import { complaintServiceIns1 } from "@app/features/complaints/ComplaintService";
import { complaintDetailsRepositoryIns } from "@app/repositories/ComplaintDetailsRepository";
import { ComplaintDetails } from "@app/models/ComplaintDetails";
import { SmartphoneComplainFieldIdEnum } from "@app/enums/SmartphoneComplainFieldIdEnum";
import { AppConstants } from "@app/constants/AppConstants";

export class AfterPaytmCallbackEventEmitter extends BaseQueue {
    /**
     *
     */
    constructor() {
        super(EventEmitterIdentifierEnum.AFTER_PAYTM_CALLBACK_EVENTEMITTER);
    }

    protected getQueueTime() {
        return 500;
    }

    public async handleJob(data?: any) {
        await this.sendEmail(data);
    }

    public sendEmail = async (data: any) => {
        let paytmResp: PaytmCallbackResponseEntity = data;
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.isPaymentSucces, callableFunctionParams: paytmResp }).setMethod({ callableFunction: this.generateReport, notBreakWhenReturnedValueNotTruthy: true, storeResultAs: StoreResultAs.ORDER_DETAIL_FOR_EMAIL_TEMPLATE }).coordinate();
        // .setMethod({ callableFunction: this.sendOrdeEmailToCustomer, notBreakWhenReturnedValueNotTruthy: true, storeResultAs: StoreResultAs.ORDER_DETAIL_FOR_EMAIL_TEMPLATE })
        // .setMethod({ callableFunction: this.sendComplaintDetailEmailToServiceCenter })
    }

    public generateReport = async (params: MethodParamEntity) => {
        await this.generateComplainReport(params);
        await this.generateInvoiceReport(params);
        return await this.sendOrdeEmailToCustomer(params);
    }

    public generateComplainReport = async (params: MethodParamEntity) => {
        let paytmResp = params.topMethodParam;
        let orderID = userPlanServiceIns.removeOrderPrefixFromOrderNo(paytmResp.ORDERID);
        let objectDetails = await complaintServiceIns.getComplaintDetailsForComplaintReport(parseInt(orderID));
        if (objectDetails) {
            await htmlToPDFConverterIns.convertComplainAnalysisReport(objectDetails, await this.addReportNameToComplainDetails.bind(null, objectDetails.complain_id, SmartphoneComplainFieldIdEnum.COMPLAINT_REPORT));
        }
    }

    private addReportNameToComplainDetails = async (complain_id, field_id, fileName) => {
        let complaintDetails = new ComplaintDetails();
        complaintDetails.field_id = field_id;
        complaintDetails.field_val = fileName;
        complaintDetails.complaint_id = complain_id;
        await complaintDetailsRepositoryIns.create([complaintDetails]);
    }

    public generateInvoiceReport = async (params: MethodParamEntity) => {
        let paytmResp = params.topMethodParam;
        let orderID = userPlanServiceIns.removeOrderPrefixFromOrderNo(paytmResp.ORDERID);
        let result = await complaintServiceIns.getComplaintDetailsForComplaintInvoiceReport(parseInt(orderID));
        let paymentDetails = await complaintServiceIns1.extractOutPaymentDetails(result.complainDetails);
        let userDetails = result.complainDetails.user;
        let companyDetails = { company_name: AppConstants.COMPANY_NAME, gstin: config.get("company.gstin"), pan: config.get("company.pan"), city_name: result.userAddress[0]['name'], base_url: UtilsHelper.getBaseURL(), customer_name: userDetails.name };
        Object.assign(companyDetails, paymentDetails);
        await htmlToPDFConverterIns.convertInvoiceReport(companyDetails, await this.addReportNameToComplainDetails.bind(null, result.complainDetails.id, SmartphoneComplainFieldIdEnum.INVOICE_REPORT));
    }

    public sendOrdeEmailToCustomer = async (methodParamEntity: MethodParamEntity) => {
        let result = null;
        try {
            setTimeout(async () => {
                let paytmResp = methodParamEntity.topMethodParam;
                let result = await userPlanRepositoryServiceIns.getDetailsForOrderEmailTemp(userPlanServiceIns.removeOrderPrefixFromOrderNo(paytmResp.ORDERID));
                if (result) {
                    fileReaderServiceIns.readEmailTemplate("order-detail.html", this.sendOrderEmail.bind(null, result));
                }
                this.sendComplaintDetailEmailToServiceCenter(result, methodParamEntity.topMethodParam);
            }, 5000);
        } catch (error) {
            throw error;
        }
        return result;
    }

    public sendComplaintDetailEmailToServiceCenter = async (orderDetail: any, paytmResp: any) => {
        // let paytmResp = methodParamEntity.topMethodParam;
        // let orderDetail = methodParamEntity.methodReturnedValContainer[StoreResultAs.ORDER_DETAIL_FOR_EMAIL_TEMPLATE];
        if (this.isPlanPremiumPlan(orderDetail[0])) {
            let orderId = userPlanServiceIns.removeOrderPrefixFromOrderNo(paytmResp.ORDERID);
            let serviceCenterCompensationEmailDetails = await complaintServiceIns.getComplainDetailsForServiceCenterEmail(parseInt(orderId));
            if (serviceCenterCompensationEmailDetails) {
                fileReaderServiceIns.readEmailTemplate("Email-template-etark.html", this.sendCompensationEmailToServiceCenter.bind(null, serviceCenterCompensationEmailDetails));
            }
        }
    }

    public sendCompensationEmailToServiceCenter = async (sellerCompensationEmailEntity: SellerCompensationEmailEntity, error, data) => {
        // bapi.rahul@gmail.com
        sellerCompensationEmailEntity = await this.addBaseurl(sellerCompensationEmailEntity);
        nodeMailerServiceIns.sendHtml(config.get("mail.from"), "bapi.rahul@gmail.com", "Request for compensationOrder email", UtilsHelper.replaceAllStr(sellerCompensationEmailEntity, data));
    }

    public sendOrderEmail = async (orderDetail, error, data) => {
        let orderDetailObj = orderDetail[0];
        orderDetailObj.is_download_report_to_be_shown = await this.isDownloadReportToBeShown(orderDetailObj) ? "inline-block" : "none";
        // orderDetailObj.email = "iamabornprogrammer@gmail.com";
        if (orderDetail[0].field_id === SmartphoneComplainFieldIdEnum.INVOICE_REPORT) {
            orderDetailObj.invoice_url = UtilsHelper.getBaseURLForAssetFile() + orderDetail[0].field_val;
            orderDetailObj.report_url = UtilsHelper.getBaseURLForAssetFile() + orderDetail[1].field_val;
        } else {
            orderDetailObj.invoice_url = UtilsHelper.getBaseURLForAssetFile() + orderDetail[1].field_val;
            orderDetailObj.report_url = UtilsHelper.getBaseURLForAssetFile() + orderDetail[0].field_val;
        }
        orderDetailObj = await this.addBaseurl(orderDetailObj);
        nodeMailerServiceIns.sendHtml(config.get("mail.from"), orderDetailObj.email, "Order email", UtilsHelper.replaceAllStr(orderDetailObj, data));
    }

    private addBaseurl = async (orderDetailObj: any) => {
        orderDetailObj.base_url = UtilsHelper.getBaseURL();
        return orderDetailObj;
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