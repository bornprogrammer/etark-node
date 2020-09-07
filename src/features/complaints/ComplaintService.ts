import BaseService from "@app/services/BaseService";
import { Complaint } from "@app/models/Complaint";
import { SellerCompensationEmailEntity } from "@app/entities/SellerCompensationEmailEntity";
import { SmartphoneComplainFieldsEnum } from "@app/enums/SmartphoneComplainFieldsEnum";
import { ComplaintDetails } from "@app/models/ComplaintDetails";
import ArrayHelper from "@app/helpers/ArrayHelper";
import { DateHelper } from "@app/helpers/DateHelper";

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

    // public getIMEIFieldValue = async (complaintDetails: ComplaintDetails[]) => {
    //     let imeiNumber = this.getComplainDetailFieldValueByFieldName(com);

    //     return imeiNumber;
    // }

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

}

export const complaintServiceIns1 = new ComplaintService();