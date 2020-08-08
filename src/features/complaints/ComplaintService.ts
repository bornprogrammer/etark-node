import BaseService from "@app/services/BaseService";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { complaintRepositoryIns } from "./ComplaintRepository";
import { complaintRepositoryIns as complaintRepositoryIns1 } from "@app/repositories/ComplaintRepository";
import { GetComplaintDetailsParamsEntity } from "@app/repo-method-param-entities/GetComplaintDetailsParamsEntity";
import { httpPostServiceIns } from "@app/http-services/HttpPostService";
import { AppConstants } from "@app/constants/AppConstants";
import { ChancesOfWinningMLCasesService, chancesOfWinningMLCasesServiceIns } from "@app/services/ChancesOfWinningMLCasesService";

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

}


export const complaintServiceIns = new ComplaintService();