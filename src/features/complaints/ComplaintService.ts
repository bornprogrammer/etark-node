import BaseService from "@app/services/BaseService";
import { Complaint } from "@app/models/Complaint";
import { SellerCompensationEmailEntity } from "@app/entities/SellerCompensationEmailEntity";
import { SmartphoneComplainFieldsEnum } from "@app/enums/SmartphoneComplainFieldsEnum";
import { ComplaintDetails } from "@app/models/ComplaintDetails";
import ArrayHelper from "@app/helpers/ArrayHelper";
import { DateHelper } from "@app/helpers/DateHelper";
import { UtilsHelper } from "@app/helpers/UtilsHelper";
import { ObjectHelper } from "@app/helpers/ObjectHelper";

export class ComplaintService extends BaseService {

    /**
     *
     */
    constructor() {
        super();
    }

    public getComplainDetailFieldValueByFieldName = async (complaintDetails: ComplaintDetails[], fieldName: SmartphoneComplainFieldsEnum) => {
        let fieldVal = null;
        if (ArrayHelper.isArrayValid(complaintDetails)) {
            complaintDetails.forEach(complaintDetail => {
                if (complaintDetail.field.field_name === fieldName) {
                    fieldVal = complaintDetail.field_val;
                }
            });
        }
        return fieldVal;
    }


    public extractOutComplainFieldDetails = async (complaint: Complaint): Promise<SellerCompensationEmailEntity> => {
        let objectDetails: SellerCompensationEmailEntity = {};
        if (complaint) {
            complaint.complainDetails.forEach((fieldDetail) => {
                if (fieldDetail.field.field_name === SmartphoneComplainFieldsEnum.MODEL_NAME) {
                    objectDetails.model_name = fieldDetail.field_val;
                }
                else if (fieldDetail.field.field_name === SmartphoneComplainFieldsEnum.IMEI_NUMBER) {
                    objectDetails.imei_number = fieldDetail.field_val;
                }
                else if (fieldDetail.field.field_name === SmartphoneComplainFieldsEnum.PHONE_PRICE) {
                    objectDetails.phone_price = fieldDetail.field_val;
                }
                else if (fieldDetail.field.field_name === SmartphoneComplainFieldsEnum.UNDER_WARRANTY) {
                    objectDetails.under_warranty = fieldDetail.field_val;
                }
                else if (fieldDetail.field.field_name === SmartphoneComplainFieldsEnum.WINNING_CHANCES_ML_RESPONSE) {
                    objectDetails.winning_chances = fieldDetail.field_val;
                }
                else if (fieldDetail.field.field_name === SmartphoneComplainFieldsEnum.COMPENSATION_TYPE) {
                    if (fieldDetail.field_val === "free_servicing") {
                        objectDetails.compensation_type = "Free Servicing";
                    } else {
                        objectDetails.compensation_type = "Product Replacement";
                    }
                }
                else if (fieldDetail.field.field_name === SmartphoneComplainFieldsEnum.COMPENSATION_ML_RESPONSE) {
                    objectDetails.compensation_ml_response = fieldDetail.field_val;
                }
            })
            objectDetails.company_name = complaint.makerDetail.display_name;
            objectDetails.complain_id = complaint.id;
        }
        return objectDetails;
    }

    public extractOutPaymentDetails = async (complaint: Complaint) => {
        let result = {};
        if (complaint) {
            result['order_no'] = complaint.userPlan.userPayments[0].order_no;
            result['order_id'] = complaint.userPlan.userPayments[0].id;
            result['grand_total'] = complaint.userPlan.userPayments[0].grand_total;
            result['sub_total'] = complaint.userPlan.userPayments[0].sub_total + complaint.userPlan.userPayments[0].gateway_charge;
            result['tax'] = complaint.userPlan.userPayments[0].tax;
            result['updatedAt'] = complaint.userPlan.userPayments[0]['updatedAt'];
            result['ordered_date'] = DateHelper.getReadableDateFormat(complaint.userPlan.userPayments[0]['updatedAt']);
        }
        return result;
    }

    public extractOutAllComplaintDetails = async (complaint: Complaint[]) => {
        let result = null;
        if (complaint) {
            result = [];
            complaint.forEach((complaintItem) => {
                // complaintInfo['tax'] = paymentDetails.tax;
                let complaintInfo = { complainStatus: complaintItem.status, complaintCreatedAt: DateHelper.getReadableDateFormat(complaintItem['createdAt']), userName: complaintItem.user.name, userEmail: complaintItem.user.email, userMobileNumber: complaintItem.user.mobile_number, order_no: "", grand_total: 0, payment_status: "", sub_total: 0, tax: 0, gateway_charge: 0, plan_name: "", plan_components_details: "", delivery_amount: 0, distance_meters: 0, delivery_status: "", service_center_status: "", sc_imei_number: "", device_front_image: "", device_back_image: "", phone_warranty: "", service_to_be_done: "", invoice_total_amount: 0, proforma_invoice_image: "", device_delivery_date: "", due_date: "", not_warranty_reason: "", sc_order_created_at: "", device_front_image1: "", device_back_image1: "", final_invoice_image: "", final_invoice_amount: 0, ready_to_dispatch_created_at: "" };

                if (ArrayHelper.isArrayValid(complaintItem.complainDetails)) {
                    complaintItem.complainDetails.forEach((complaintDetails) => {
                        complaintInfo[complaintDetails.field.field_name] = complaintDetails.field_val;
                    })
                }
                if (ArrayHelper.isArrayValid(complaintItem.userPlan.userPayments)) {
                    let paymentDetails = complaintItem.userPlan.userPayments[0];
                    complaintInfo['order_no'] = paymentDetails.order_no;
                    complaintInfo['grand_total'] = paymentDetails.grand_total;
                    complaintInfo['payment_status'] = paymentDetails.payment_status;
                    complaintInfo['sub_total'] = paymentDetails.sub_total;
                    complaintInfo['tax'] = paymentDetails.tax;
                    complaintInfo['gateway_charge'] = paymentDetails.gateway_charge;

                    complaintInfo['plan_name'] = complaintItem.userPlan.plan.plan_name;
                    let userPlanComponents = complaintItem.userPlan.UserPlanComponents;
                    complaintInfo['plan_components_details'] = "";
                    if (ArrayHelper.isArrayValid(userPlanComponents)) {
                        userPlanComponents.forEach((componentItem) => {
                            complaintInfo['plan_components_details'] += " " + componentItem.planComponent.component_display_name + "=" + componentItem.component_price
                        })
                    }
                }

                if (complaintItem.userPlan.pickupDeliveryDetail) {

                    let pickupDeliveryDetails = complaintItem.userPlan.pickupDeliveryDetail;
                    complaintInfo['delivery_amount'] = pickupDeliveryDetails.delivery_amount;
                    complaintInfo['distance_meters'] = pickupDeliveryDetails.distance_meters;
                    complaintInfo['delivery_status'] = pickupDeliveryDetails['status'];

                    complaintInfo['service_center_status'] = "";

                    pickupDeliveryDetails.serviceCenterActivity.forEach((serviceCenterAct) => {
                        complaintInfo['service_center_status'] += " " + serviceCenterAct.activity_type + " on " + DateHelper.getReadableDateFormat(serviceCenterAct['createdAt']);
                    })

                    if (ArrayHelper.isArrayValid(pickupDeliveryDetails.serviceCenterOrder)) {
                        let serviceCenterOrders = pickupDeliveryDetails.serviceCenterOrder[0];
                        complaintInfo['sc_imei_number'] = serviceCenterOrders.imei_number;
                        complaintInfo['device_front_image'] = UtilsHelper.getBaseURLForUploadedImage(serviceCenterOrders.device_front_image);
                        complaintInfo['device_back_image'] = UtilsHelper.getBaseURLForUploadedImage(serviceCenterOrders.device_back_image);
                        complaintInfo['phone_warranty'] = serviceCenterOrders.phone_warranty;
                        complaintInfo['service_to_be_done'] = serviceCenterOrders.service_to_be_done;
                        complaintInfo['invoice_total_amount'] = serviceCenterOrders.invoice_total_amount;
                        complaintInfo['proforma_invoice_image'] = UtilsHelper.getBaseURLForUploadedImage(serviceCenterOrders.proforma_invoice_image);
                        complaintInfo['device_delivery_date'] = DateHelper.getReadableDateFormat(serviceCenterOrders.device_delivery_date);
                        complaintInfo['due_date'] = DateHelper.getReadableDateFormat(serviceCenterOrders.due_date);
                        complaintInfo['not_warranty_reason'] = serviceCenterOrders.not_warranty_reason;
                        complaintInfo['sc_order_created_at'] = DateHelper.getReadableDateFormat(serviceCenterOrders['createdAt']);
                    }

                    if (ObjectHelper.isObjectNotEmpty(pickupDeliveryDetails.deviceDispatchDetails)) {
                        let readyToDispatchDetails = pickupDeliveryDetails.deviceDispatchDetails;
                        complaintInfo['device_front_image1'] = UtilsHelper.getBaseURLForUploadedImage(readyToDispatchDetails.device_front_image);
                        complaintInfo['device_back_image1'] = UtilsHelper.getBaseURLForUploadedImage(readyToDispatchDetails.device_back_image);
                        complaintInfo['final_invoice_image'] = UtilsHelper.getBaseURLForUploadedImage(readyToDispatchDetails.final_invoice_image);
                        complaintInfo['final_invoice_amount'] = readyToDispatchDetails.final_invoice_amount;
                        complaintInfo['ready_to_dispatch_created_at'] = DateHelper.getReadableDateFormat(readyToDispatchDetails['createdAt']);
                    }
                }
                result.push(complaintInfo);
            })
        }
        return result;
    }
}

export const complaintServiceIns1 = new ComplaintService();