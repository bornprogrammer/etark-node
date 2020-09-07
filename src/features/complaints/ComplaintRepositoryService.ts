import BaseService from "@app/services/BaseService";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { complaintRepositoryIns } from "./ComplaintRepository";
import { complaintRepositoryIns as complaintRepositoryIns1 } from "@app/repositories/ComplaintRepository";
import { httpPostServiceIns } from "@app/http-services/HttpPostService";
import { AppConstants } from "@app/constants/AppConstants";
import { chancesOfWinningMLCasesServiceIns } from "@app/services/ChancesOfWinningMLCasesService";
import { ComplaintDetails } from "@app/models/ComplaintDetails";
import { complaintDetailsRepositoryIns } from "@app/repositories/ComplaintDetailsRepository";
import { StoreResultAs } from "@app/enums/StoreResultAs";
import ArrayHelper from "@app/helpers/ArrayHelper";
import { ComplaintDetailByFieldNameParamsEntity } from "@app/repo-method-param-entities/ComplaintDetailByFieldNameParamsEntity";
import { SmartphoneComplainFieldsEnum } from "@app/enums/SmartphoneComplainFieldsEnum";
import { Complaint } from "@app/models/Complaint";
import { SellerCompensationEmailEntity } from "@app/entities/SellerCompensationEmailEntity";
import { ObjectHelper } from "@app/helpers/ObjectHelper";
import { SmartphoneComplainFieldIdEnum } from "@app/enums/SmartphoneComplainFieldIdEnum";
import { complaintServiceIns1 } from "./ComplaintService";

export class ComplaintRepositoryService extends BaseService {
    /**
     *
     */
    constructor() {
        super();
    }

    public addComplaints = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: complaintRepositoryIns.addComplaints, callableFunctionParams: params }).setMethod({ callableFunction: complaintRepositoryIns.addComplaintDetails }).coordinate();
        return result;
    }

    public addDeviceImages = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: complaintRepositoryIns.addDeviceImages, callableFunctionParams: params }).coordinate();
        return result;
    }

    public uploadInvoice = (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let uploadedInvoiceParams = { file_name: params.filename };
        return uploadedInvoiceParams;
    }

    public getChancesOfWinning = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        params.field_name = SmartphoneComplainFieldsEnum.PROBLEM_DESCRIPTION;
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.getComplaintDetails, callableFunctionParams: params }).setMethod({ callableFunction: this.callWinningChancesMLApi, resultToBeReturnedAsFinalResult: true }).setMethod({ callableFunction: this.updateWinningOfChances }).coordinate();
        return result;
    }

    public getComplaintDetails = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let getComplaintDetailsParams = new ComplaintDetailByFieldNameParamsEntity(params.complaint_id, params.field_name);
        let result = await complaintRepositoryIns1.getComplaintDetailByFieldName(getComplaintDetailsParams);
        // return { fieldVal: result.field_val, fieldId: result.field_id, complain_detail_id: result.id };
        return result;
    }

    public callWinningChancesMLApi = async (methodParamEntity: MethodParamEntity) => {
        let complainDetails: ComplaintDetails = methodParamEntity.lastInvokedMethodParam;
        let winningChances = null;
        if (complainDetails) {
            winningChances = await httpPostServiceIns(AppConstants.ML_MODEL_CHANCES_OF_WINNING_URL).setFormUrlEncodedPayload({ com: complainDetails.field_val }).setExpectedResponseAsJson().call();
        }
        return chancesOfWinningMLCasesServiceIns.getHigherChances(winningChances);
    }

    public updateWinningOfChances = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        params.winningChances = methodParamEntity.lastInvokedMethodParam.winning_chances_val;
        params.field_name = SmartphoneComplainFieldsEnum.WINNING_CHANCES_ML_RESPONSE;
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.getComplaintDetails, callableFunctionParams: params, notBreakWhenReturnedValueNotTruthy: true }).setMethod({ callableFunction: this.upsertWinningOfChances }).coordinate();
        return result;
    }

    public upsertWinningOfChances = async (methodParamEntity: MethodParamEntity) => {
        let complaintDetails: ComplaintDetails = methodParamEntity.lastInvokedMethodParam;
        let params = methodParamEntity.topMethodParam;
        if (!complaintDetails) {
            complaintDetails = new ComplaintDetails();
            complaintDetails.field_val = params.winningChances;
            complaintDetails.field_id = SmartphoneComplainFieldIdEnum.WINNING_CHANCES_ML_RESPONSE;
            complaintDetails.complaint_id = params.complaint_id;
            await complaintDetailsRepositoryIns.create([complaintDetails]);
        } else {
            await complaintDetailsRepositoryIns.update({ field_val: params.winningChances, complain_detail_id: complaintDetails.id });
        }
        return true;
    }

    public addCompensation = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = this.getMethodCoordinator().setMethod({ callableFunction: this.createComplainDetail, callableFunctionParams: params, storeResultAs: StoreResultAs.ADD_COMPENSATION }).setMethod({ callableFunction: this.getComplaintDetailByFieldNameAmount, callableFunctionParams: SmartphoneComplainFieldsEnum.PHONE_PRICE }).setMethod({ callableFunction: this.callCompensationAmountMLApi }).setMethod({ callableFunction: this.createCompensationMLResponse }).coordinate();
        return result;
    }

    public createComplainDetail = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let complaintDetailsObj = this.buildComplainDetailsInsForCompensation(params);
        let result = await complaintDetailsRepositoryIns.create([complaintDetailsObj]);
        return result[0];
    }

    public getComplaintDetailByFieldNameAmount = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let getComplaintDetailsParams = new ComplaintDetailByFieldNameParamsEntity(params.complain_id, methodParamEntity.methodParam);
        let result = await complaintRepositoryIns1.getComplaintDetailByFieldName(getComplaintDetailsParams);
        return { fieldVal: result.field_val, fieldId: result.field_id, complain_detail_id: result.id };
    }

    public callCompensationAmountMLApi = async (methodParamEntity: MethodParamEntity) => {
        let fieldVal = methodParamEntity.lastInvokedMethodParam;
        let callApi = await httpPostServiceIns(AppConstants.ML_MODEL_COMPENSATION_URL).setFormUrlEncodedPayload({ amount: fieldVal.fieldVal }).setExpectedResponseAsJson().call();
        return callApi;
    }

    public createCompensationMLResponse = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let compensationMLResponse = methodParamEntity.lastInvokedMethodParam;
        params.ml_resp = compensationMLResponse
        let result = await complaintDetailsRepositoryIns.create([this.buildComplainDetailsInsForMLCompensationResp(params)]);
        return methodParamEntity.methodReturnedValContainer[StoreResultAs.ADD_COMPENSATION];
    }

    public updateCompensationVal = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        params.field_val = params.compensation_type;
        let result = await complaintDetailsRepositoryIns.update(params);
        return result;
    }

    public updateCompensation = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = this.getMethodCoordinator().setMethod({ callableFunction: this.updateCompensationVal, callableFunctionParams: params }).setMethod({ callableFunction: this.getComplaintDetailByFieldNameAmount, callableFunctionParams: SmartphoneComplainFieldsEnum.PHONE_PRICE }).setMethod({ callableFunction: this.callCompensationAmountMLApi, storeResultAs: StoreResultAs.COMPENSATION_ML_API_RESP }).setMethod({ callableFunction: this.getComplaintDetailByFieldNameAmount, callableFunctionParams: SmartphoneComplainFieldsEnum.COMPENSATION_ML_RESPONSE }).setMethod({ callableFunction: this.updateCompensationMLResponse }).coordinate();
        return result;
    }

    public updateCompensationMLResponse = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let complainDetailObj = methodParamEntity.lastInvokedMethodParam;
        params.field_val = methodParamEntity.methodReturnedValContainer[StoreResultAs.COMPENSATION_ML_API_RESP];
        params.complain_detail_id = complainDetailObj.complain_detail_id;
        let result = await complaintDetailsRepositoryIns.update(params);
        return result;
    }

    private buildComplainDetailsInsForCompensation = (params: any): ComplaintDetails => {
        let complaintDetails = new ComplaintDetails();
        complaintDetails.field_val = params.compensation_type // free_servicing,product_replacement
        complaintDetails.complaint_id = params.complain_id;
        complaintDetails.field_id = SmartphoneComplainFieldIdEnum.COMPENSATION_TYPE;
        return complaintDetails;
    }

    private buildComplainDetailsInsForMLCompensationResp = (params: any): ComplaintDetails => {
        let complaintDetails = new ComplaintDetails();
        complaintDetails.field_val = params.ml_resp;
        complaintDetails.complaint_id = params.complain_id;
        complaintDetails.field_id = SmartphoneComplainFieldIdEnum.COMPENSATION_ML_RESPONSE;
        return complaintDetails;
    }

    public getComplainDetailsForServiceCenterEmail = async (orderId: number) => {
        let result = await complaintRepositoryIns1.getComplainDetailsForServiceCenterEmail(orderId);
        let sellerCompensationEmailEntity = this.extractInfo(result);
        return sellerCompensationEmailEntity;
    }

    private extractInfo = (complaint: Complaint) => {
        let details: SellerCompensationEmailEntity = null;
        if (ObjectHelper.isObjectNotEmpty(complaint)) {
            details = { company_name: "", user_name: "", product_detail: "", compensation_value: "", imei_number: "", model_name: "", winning_chances: "", how_long_phone_owned: "", compensation_type: "" };
            details.user_name = complaint.user.name;
            details.company_name = complaint.makerDetail.display_name;
            complaint.complainDetails.forEach(complainDetail => {
                if (complainDetail.field.field_name === SmartphoneComplainFieldsEnum.IMEI_NUMBER) {
                    details.imei_number = complainDetail.field_val;
                } else if (complainDetail.field.field_name === SmartphoneComplainFieldsEnum.COMPENSATION_ML_RESPONSE) {
                    details.compensation_value = complainDetail.field_val;
                }
                else if (complainDetail.field.field_name === SmartphoneComplainFieldsEnum.WINNING_CHANCES_ML_RESPONSE) {
                    details.winning_chances = complainDetail.field_val;
                }
                else if (complainDetail.field.field_name === SmartphoneComplainFieldsEnum.MODEL_NAME) {
                    details.model_name = complainDetail.field_val;
                    details.product_detail = complainDetail.field_val;
                }
                else if (complainDetail.field.field_name === SmartphoneComplainFieldsEnum.HOW_LONG_PHONE_OWNED) {
                    details.how_long_phone_owned = complainDetail.field_val;
                }
                else if (complainDetail.field.field_name === SmartphoneComplainFieldsEnum.COMPENSATION_TYPE) {
                    details.compensation_type = complainDetail.field_val === "free_servicing" ? "Free Servicing" : "Product Replacement";
                }
            });
        }
        return details;
    }

    public updateComplaints = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.updateComplaintIfExists, callableFunctionParams: params }).setMethod({ callableFunction: this.updateComplainDetails }).coordinate();
        return result;
    }

    public updateComplaintIfExists = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await complaintRepositoryIns.update({ id: params.complain_id, maker_detail_id: params.maker_detail_id, user_id: params.user_id })
        return result;
    }

    public updateComplainDetails = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = null;
        if (ArrayHelper.isArrayValid(params.complaints_details)) {
            for (const complainDetail of params.complaints_details) {
                result = await complaintDetailsRepositoryIns.updateByComplainIdNFieldId({ complainId: params.complain_id, fieldVal: complainDetail.field_val, fieldId: complainDetail.field_id });
            }
        }
        return result;
    }

    public updateDeviceImages = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.updateDeviceImagesIfAny, callableFunctionParams: params }).coordinate();
        return result;
    }

    public updateDeviceImagesIfAny = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let complainDetails = params.complaints_details;
        let result = await complaintDetailsRepositoryIns.updateByComplainIdNFieldId({ complainId: params.complaint_id, fieldVal: complainDetails[0].field_val, fieldId: complainDetails[0].field_id });
        result = await complaintDetailsRepositoryIns.updateByComplainIdNFieldId({ complainId: params.complaint_id, fieldVal: complainDetails[1].field_val, fieldId: complainDetails[1].field_id });
        return result;
    }

    public addComplainStrength = async (params: MethodParamEntity) => {
        let complainStrengthDetails = params.topMethodParam;
        if (ArrayHelper.isArrayValid(complainStrengthDetails.complain_strength_details)) {
            for (const item of complainStrengthDetails.complain_strength_details) {
                await complaintRepositoryIns.addComplaintStrength({ complaint_id: complainStrengthDetails.complain_id, field_id: item.field_id, field_val: item.field_val });
            }
        }
        return true;
    }

    public updateComplainStrength = async (params: MethodParamEntity) => {
        let complainStrengthDetails = params.topMethodParam;
        if (ArrayHelper.isArrayValid(complainStrengthDetails.complain_strength_details)) {
            for (const item of complainStrengthDetails.complain_strength_details) {
                await complaintDetailsRepositoryIns.updateByComplainIdNFieldId({ complainId: complainStrengthDetails.complain_id, fieldId: item.field_id, fieldVal: item.field_val });
            }
        }
        return true;
    }

    public getComplaintDetailsForComplaintReport = async (orderId: number) => {
        let result = await complaintRepositoryIns1.getComplaintDetailsForComplaintReport(orderId);
        let objectDetails: SellerCompensationEmailEntity = await complaintServiceIns1.extractOutComplainFieldDetails(result);
        let merchantId = await complaintServiceIns1.getComplainDetailFieldValueByFieldName(result.complainDetails, SmartphoneComplainFieldsEnum.MERCHANT_ID);
        if (merchantId === AppConstants.MERCHANT_FIELD_OTHER_VALUE) {
            objectDetails.merchant_name = await complaintServiceIns1.getComplainDetailFieldValueByFieldName(result.complainDetails, SmartphoneComplainFieldsEnum.MERCHANT_NAME_OFFLINE);
        } else {
            let merchantDetails = await complaintRepositoryIns1.getMerchantDetails(merchantId);
            objectDetails.merchant_name = merchantDetails.merchant_name;
        }
        return objectDetails;
    }

    public getComplaintDetailsForComplaintInvoiceReport = async (orderNo: number) => {
        let result = await complaintRepositoryIns1.getComplaintDetailsForComplaintInvoiceReport(orderNo);
    }

}

export const complaintServiceIns = new ComplaintRepositoryService();