import BaseRepository from "@app/repositories/BaseRepository";
import MethodParamEntity from "@app/entities/MethodParamEntity";
import { Complaint } from "@app/models/Complaint";
import { ComplaintDetails } from "@app/models/ComplaintDetails";

export class ComplaintRepository extends BaseRepository {

    /**
     *
     */
    constructor() {
        super();
    }

    public addComplaints = async (methodParamEntity: MethodParamEntity) => {
        let params = methodParamEntity.topMethodParam;
        let complaintParams = { user_id: params.user_id, maker_detail_id: params.maker_detail_id, status: 'active' };
        let result = await Complaint.create(complaintParams);
        return result;
    }

    public addComplaintDetails = async (methodParamEntity: MethodParamEntity) => {
        let lastInvokedMethodParam = methodParamEntity.lastInvokedMethodParam;
        let params = methodParamEntity.topMethodParam;
        for (const complaintDetailsObj of params.complaints_details) {
            await ComplaintDetails.create({ complaint_id: lastInvokedMethodParam.id, field_id: complaintDetailsObj.field_id, field_val: complaintDetailsObj.field_val });
        }
        return lastInvokedMethodParam;
    }

    public addDeviceImages = async (methodParamEntity: MethodParamEntity) => {
        // let lastInvokedMethodParam = methodParamEntity.topMethodParam;
        let params = methodParamEntity.topMethodParam;
        let result = null;
        for (const complaintDetailsObj of params.complaints_details) {
            result = await ComplaintDetails.create({ complaint_id: params.complaint_id, field_id: complaintDetailsObj.field_id, field_val: complaintDetailsObj.field_val });
        }
        return result;
    }


}

export const complaintRepositoryIns = new ComplaintRepository();