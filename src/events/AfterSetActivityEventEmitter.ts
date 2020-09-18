import { BaseQueue } from "./BaseQueue";
import { EventEmitterIdentifierEnum } from "@app/enums/EventEmitterIdentifierEnum";
import { userPlanRepositoryServiceIns } from "@app/features/user-plan/UserPlanRepositoryService";
import { ServiceCenterActivityTypeEnum } from "@app/enums/ServiceCenterActivityTypeEnum";
import { userRepositoryServiceIns } from "@app/features/users/UserRepositoryService";
import { complaintRepositoryIns } from "@app/repositories/ComplaintRepository";
import { PhoneWarrantyTypeEnum } from "@app/enums/PhoneWarrantyTypeEnum";
import { fileReaderServiceIns } from "@app/services/FileReaderService";
import { UtilsHelper } from "@app/helpers/UtilsHelper";
import { nodeMailerServiceIns } from "@app/services/NodeMailerService";
import config from "config";
import { Complaint } from "@app/models/Complaint";
import { DateHelper } from "@app/helpers/DateHelper";

export class AfterSetActivityEventEmitter extends BaseQueue {
    /**
     *
     */
    constructor() {
        super(EventEmitterIdentifierEnum.AFTER_SET_ACTIVITY_EVENTEMITTER);
    }

    public async handleJob(data?: any) {
        let params = data;
        await this.refundInspectionFee(params);
    }

    public refundInspectionFee = async (params: any) => {
        if (params.activity_type === ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_INSPECTION_FEE_DENIED) {
            await userPlanRepositoryServiceIns.refundInspectionFee(params.pickup_delivery_id);
        } else if (params.activity_type === ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_SERVICE_DENIED) {
            await this.assignAnotherServiceCenter(params);
        } else if (params.activity_type === ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_READY_TO_DISPATCH) {
            this.sendFinalInvoiceEmail(params);
        } else if (params.activity_type === ServiceCenterActivityTypeEnum.ACTIVITY_TYPE_USER_TO_CONFIRM) {
            this.sendEstimateInvoiceEmail(params);
        }
    }

    public assignAnotherServiceCenter = async (params: any) => {
        await userRepositoryServiceIns.assignNewServiceCenter(params.pickup_delivery_id);
    }

    public sendFinalInvoiceEmail = async (params: any) => {
        let result = await complaintRepositoryIns.getComplainDetailForFinalInvoice(params.pickup_delivery_id);
        if (result) {
            let object = await this.getServiceCenterDetails(result);
            let htmlFileName = "sc-final-invoice-nowaranty.html";
            if (object.phoneWarranty === PhoneWarrantyTypeEnum.IN_WARRANTY) {
                htmlFileName = "sc-final-invoice-inwarranty.html";
            } else {
                object.invoice_url = UtilsHelper.getBaseURLForUploadedImage(result.userPlan.pickupDeliveryDetail.deviceDispatchDetails.final_invoice_image);
            }
            object.emailTitle = "Final Invoice";
            fileReaderServiceIns.readEmailTemplate(htmlFileName, this.sendEmail.bind(null, object));
        }
    }

    private getServiceCenterDetails = async (result: Complaint) => {
        let object: any = { name: result.user.name, email: result.user.email, order_no: result.userPlan.userPayments[0].order_no, estimatedAmount: result.userPlan.pickupDeliveryDetail.serviceCenterOrder[0].invoice_total_amount, phoneWarranty: result.userPlan.pickupDeliveryDetail.serviceCenterOrder[0].phone_warranty, invoice_url: "", base_url: UtilsHelper.getBaseURL() };
        if (result.userPlan.pickupDeliveryDetail.deviceDispatchDetails) {
            object.finalAmount = result.userPlan.pickupDeliveryDetail.deviceDispatchDetails.final_invoice_amount;
        }
        return object;
    }

    private getWarrantyValue = async (warranty: string) => {
        let warrantyValue = "";
        switch (warranty) {
            case PhoneWarrantyTypeEnum.IN_WARRANTY:
                warrantyValue = "In Warranty";
                break;
            case PhoneWarrantyTypeEnum.NON_WARRANTY:
                warrantyValue = "Non Warranty";
                break;
            case PhoneWarrantyTypeEnum.OUT_OF_WARRANTY:
                warrantyValue = "Out of  Warranty";
                break;
        }
        return warrantyValue;
    }

    public sendEmail = async (orderDetailObj, err, htmlStr: string) => {
        nodeMailerServiceIns.sendHtml(config.get("mail.from"), orderDetailObj.email, orderDetailObj.emailTitle, UtilsHelper.replaceAllStr(orderDetailObj, htmlStr));
    }

    public sendEstimateInvoiceEmail = async (params: any) => {
        let result = await complaintRepositoryIns.getComplainDetailForFinalInvoice(params.pickup_delivery_id);
        if (result) {
            let object: any = await this.getServiceCenterDetails(result);
            object.imei_number = result.userPlan.pickupDeliveryDetail.serviceCenterOrder[0].imei_number;
            object.estimated_due_date = DateHelper.getReadableDateFormat(result.userPlan.pickupDeliveryDetail.serviceCenterOrder[0].due_date);
            let url = config.get("client_base_url") + "servicePayment?id=" + params.pickup_delivery_id + "&type=";
            object.payment_link = url + "accept";
            object.decline_link = url + "deny";
            object.services = result.userPlan.pickupDeliveryDetail.serviceCenterOrder[0].service_to_be_done;
            object.warranty = await this.getWarrantyValue(result.userPlan.pickupDeliveryDetail.serviceCenterOrder[0].phone_warranty);
            object.reason_for_non_warranty = result.userPlan.pickupDeliveryDetail.serviceCenterOrder[0].not_warranty_reason ?? "N/A";
            let htmlFileName = "service-centre-cost - nowarranty.html";
            if (object.phoneWarranty === PhoneWarrantyTypeEnum.IN_WARRANTY) {
                htmlFileName = "service-centre-cost-inwarranty.html";
            } else {
                object.invoice_url = UtilsHelper.getBaseURLForUploadedImage(result.userPlan.pickupDeliveryDetail.serviceCenterOrder[0].proforma_invoice_image);
            }
            object.emailTitle = "Service Centre Estimate Invoice";
            fileReaderServiceIns.readEmailTemplate(htmlFileName, this.sendEmail.bind(null, object));
        }
    }
}

export const afterSetActivityEventEmitterIns = new AfterSetActivityEventEmitter();