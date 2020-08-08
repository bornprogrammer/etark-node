import BaseService from "@app/services/BaseService";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { complaintRepositoryIns } from "./ComplaintRepository";
import { complaintRepositoryIns as complaintRepositoryIns1 } from "@app/repositories/ComplaintRepository";
import { GetComplaintDetailsParamsEntity } from "@app/repo-method-param-entities/GetComplaintDetailsParamsEntity";

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
    }

    public getComplaintDetails = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let getComplaintDetailsParams = new GetComplaintDetailsParamsEntity(params.complaint_id);
        let result = await complaintRepositoryIns1.getComplaintDetails(getComplaintDetailsParams);
        return result;
    }

    public callWinningChancesMLApi = async (methodParamEntity: MethodParamEntity) => {

    }

}


export const complaintServiceIns = new ComplaintService();