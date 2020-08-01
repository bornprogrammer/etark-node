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

}


export const complaintServiceIns = new ComplaintService();