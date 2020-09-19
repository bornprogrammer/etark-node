
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
import { htmlToPDFConverterIns } from "@app/services/HTMLToPDFConverter";
import { complaintServiceIns1 } from "@app/features/complaints/ComplaintService";
import { SmartphoneComplainFieldIdEnum } from "@app/enums/SmartphoneComplainFieldIdEnum";
import { AppConstants } from "@app/constants/AppConstants";
import ArrayHelper from "@app/helpers/ArrayHelper";
import { Complaint } from "@app/models/Complaint";

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
        await this.getMethodCoordinator().setMethod({ callableFunction: this.isPaymentSucces, callableFunctionParams: paytmResp }).setMethod({ callableFunction: this.generateInvoiceReport, notBreakWhenReturnedValueNotTruthy: true, storeResultAs: StoreResultAs.ORDER_DETAIL_FOR_EMAIL_TEMPLATE }).coordinate();
    }

    public generateInvoiceReport = async (params: MethodParamEntity) => {
        let paytmResp = params.topMethodParam;
        let orderID = userPlanServiceIns.removeOrderPrefixFromOrderNo(paytmResp.ORDERID);
        let result = await complaintServiceIns.getComplaintDetailsForComplaintInvoiceReport(parseInt(orderID));
        let paymentDetails = await complaintServiceIns1.extractOutPaymentDetails(result.complainDetails);
        let userDetails = result.complainDetails.user;
        let companyDetails = { company_name: AppConstants.COMPANY_NAME, gstin: config.get("company.gstin"), pan: config.get("company.pan"), city_name: "", base_url: UtilsHelper.getBaseURL(), customer_name: userDetails.name, price_table: "", support_email: config.get("support_email") };
        companyDetails.price_table = await this.buildComponentHTML(result.complainDetails);
        if (ArrayHelper.isArrayValid(result.userAddress)) {
            companyDetails.city_name = result.userAddress[0]['name'];
        }
        Object.assign(companyDetails, paymentDetails);
        await htmlToPDFConverterIns.convertInvoiceReport(companyDetails, this.generateInvoiceReportCallback.bind(null, params, result.complainDetails.id, SmartphoneComplainFieldIdEnum.INVOICE_REPORT));
    }

    public buildComponentHTML = async (complaint: Complaint) => {
        let componentDetails = complaint.userPlan['userPlanComponentAs'];
        let billTable = await this.getComponentHTML();
        let itemLength = componentDetails.length - 1;
        componentDetails.forEach((item, index) => {
            let isNext = index < itemLength;
            let object = { comp_name: "", quantity: "", rate: "", tax: "", gst: "", total_cost: "" };
            object.comp_name = this.getRowHTML(item.planComponent.component_display_name, isNext ? "comp_name" : "");
            object.quantity = this.getRowHTML("1", isNext ? "quantity" : "");
            let taxAmount: any = "0";
            let componentPrice = item.component_price;
            if (item.planComponent.is_taxable) {
                taxAmount = Math.ceil((AppConstants.CGST / 100) * componentPrice);
            }
            object.rate = this.getRowHTML(componentPrice, isNext ? "rate" : "");
            object.tax = this.getRowHTML(item.planComponent.is_taxable ? componentPrice : "-", isNext ? "tax" : "");
            object.gst = this.getRowHTML(item.planComponent.is_taxable ? taxAmount : "-", isNext ? "gst" : "");
            object.total_cost = this.getRowHTML(item.component_price + parseInt(taxAmount), isNext ? "total_cost" : "");
            billTable = UtilsHelper.replaceAllStr(object, billTable);
        })
        return billTable;
    }

    public getRowHTML = (val, val1 = "") => {
        val1 = val1.length > 0 ? `{{${val1}}}` : val1;
        return `<p style="font-size: 10px;">${val}</p>${val1}`;
    }
    public getComponentHTML = async () => {
        return `
        <tr style="display: flex; justify-content: space-between">
                    <td>
                      <h1 style="font-size: 12px">Item</h1>
                      {{comp_name}}
                      <!-- <p style="font-size: 10px;">{{comp_name}}</p> -->
                    </td>
                    <td style="text-align: center">
                      <h1 style="font-size: 12px">Quantity</h1>
                      {{quantity}}
                    </td>
                    <td style="text-align: center">
                      <h1 style="font-size: 12px">Rate / Item (₹)</h1>
                      {{rate}}
                    </td>
                    <td style="text-align: center">
                      <h1 style="font-size: 12px">Taxable Value</h1>
                      {{tax}}
                    </td>
                    <td style="text-align: center">
                      <h1 style="font-size: 12px">IGST @18%(₹)</h1>
                      {{gst}}
                    </td>
                    <td style="text-align: center">
                      <h1 style="font-size: 12px">Total (₹)</h1>
                      {{total_cost}}
                    </td>
                  </tr>`;
    }

    public generateInvoiceReportCallback = async (params, complain_id, field_id, fileName) => {
        await userPlanRepositoryServiceIns.addReportNameToComplainDetails(complain_id, field_id, fileName);
        return await this.sendOrdeEmailToCustomer(params);
    }

    public sendOrdeEmailToCustomer = async (methodParamEntity: MethodParamEntity) => {
        let result = null;
        try {
            let paytmResp = methodParamEntity.topMethodParam;
            // let fieldIds = ArrayHelper.convertArrayToMysqlInOpStr([SmartphoneComplainFieldIdEnum.INVOICE_REPORT, SmartphoneComplainFieldIdEnum.COMPLAINT_REPORT]);
            let result = await userPlanRepositoryServiceIns.getDetailsForOrderEmailTemp(userPlanServiceIns.removeOrderPrefixFromOrderNo(paytmResp.ORDERID), null);
            if (ArrayHelper.isArrayValid(result)) {
                fileReaderServiceIns.readEmailTemplate("order-detail.html", this.sendOrderEmail.bind(null, result));
            }
            this.sendComplaintDetailEmailToServiceCenter(result, methodParamEntity.topMethodParam);
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
        if (ArrayHelper.isArrayValid(orderDetail)) {
            let orderDetailObj = orderDetail[0];
            orderDetailObj.is_download_report_to_be_shown = await this.isDownloadReportToBeShown(orderDetailObj) ? "inline-block" : "none";

            orderDetail.forEach(element => {
                if (element.field_id === SmartphoneComplainFieldIdEnum.INVOICE_REPORT) {
                    orderDetailObj.invoice_url = UtilsHelper.getBaseURLForAssetFile() + element.field_val;
                } else if (element.field_id === SmartphoneComplainFieldIdEnum.COMPLAINT_REPORT) {
                    orderDetailObj.report_url = UtilsHelper.getBaseURLForAssetFile() + element.field_val;
                }
            });
            orderDetailObj = await this.addBaseurl(orderDetailObj);
            nodeMailerServiceIns.sendHtml(config.get("mail.from"), orderDetailObj.email, "Order email", UtilsHelper.replaceAllStr(orderDetailObj, data));
        }
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