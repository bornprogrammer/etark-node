import BaseService from "@app/services/BaseService";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { complaintRepositoryIns } from "./ComplaintRepository";

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

}


export const complaintServiceIns = new ComplaintService();