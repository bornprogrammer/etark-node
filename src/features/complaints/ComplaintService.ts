import BaseService from "@app/services/BaseService";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { complaintRepositoryIns } from "./ComplaintRepository";
import { complaintRepositoryIns as complaintRepositoryIns1 } from "@app/repositories/ComplaintRepository";
import { GetComplaintDetailsParamsEntity } from "@app/repo-method-param-entities/GetComplaintDetailsParamsEntity";
import { httpPostServiceIns } from "@app/http-services/HttpPostService";
import { AppConstants } from "@app/constants/AppConstants";
import { chancesOfWinningMLCasesServiceIns } from "@app/services/ChancesOfWinningMLCasesService";
import { ComplaintDetails } from "@app/models/ComplaintDetails";
import { complaintDetailsRepositoryIns } from "@app/repositories/ComplaintDetailsRepository";

export class ComplaintService extends BaseService {

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
        let result = await this.getMethodCoordinator().setMethod({ callableFunction: this.getComplaintDetails, callableFunctionParams: params }).setMethod({ callableFunction: this.callWinningChancesMLApi }).coordinate();
        return result;
    }

    public getComplaintDetails = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let getComplaintDetailsParams = new GetComplaintDetailsParamsEntity(params.complaint_id);
        let result = await complaintRepositoryIns1.getComplaintDetailByFieldName(getComplaintDetailsParams, "problem_description");
        return { fieldVal: result.field_val };
    }

    public callWinningChancesMLApi = async (methodParamEntity: MethodParamEntity) => {
        let fieldVal = methodParamEntity.lastInvokedMethodParam;
        let callApi = await httpPostServiceIns(AppConstants.ML_MODEL_CHANCES_OF_WINNING_URL).setFormUrlEncodedPayload({ com: fieldVal.fieldVal }).setExpectedResponseAsJson().call();
        return chancesOfWinningMLCasesServiceIns.getHigherChances(callApi);
    }

    public addCompensation = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = this.getMethodCoordinator().setMethod({ callableFunction: this.createComplainDetail, callableFunctionParams: params }).setMethod({ callableFunction: this.callCompensationAmountMLApi }).coordinate();
        return result;
    }

    public createComplainDetail = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let complaintDetailsObj = this.buildComplainDetailsInsForCompensation(params);
        let result = complaintDetailsRepositoryIns.create([complaintDetailsObj]);
        return result[0];
    }

    public callCompensationAmountMLApi = async (methodParamEntity: MethodParamEntity) => {
        let fieldVal = methodParamEntity.lastInvokedMethodParam;
        let callApi = await httpPostServiceIns(AppConstants.ML_MODEL_COMPENSATION_URL).setFormUrlEncodedPayload({ amount: fieldVal.fieldVal }).setExpectedResponseAsJson().call();
        return chancesOfWinningMLCasesServiceIns.getHigherChances(callApi);
    }


    public updateCompensation = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let result = await complaintDetailsRepositoryIns.update(params);
        return result;
    }


    private buildComplainDetailsInsForCompensation = (params: any): ComplaintDetails => {
        let complaintDetails = new ComplaintDetails();
        complaintDetails.field_val = params.compensation_type // free_servicing,product_replacement
        complaintDetails.complaint_id = params.complain_id;
        complaintDetails.field_id = 17;
        return complaintDetails;
    }
}

export const complaintServiceIns = new ComplaintService();