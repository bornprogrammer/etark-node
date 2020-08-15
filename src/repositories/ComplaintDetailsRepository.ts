import BaseRepository from "@app/repositories/BaseRepository";
import { ComplaintDetails } from "@app/models/ComplaintDetails";
import { UpdateComplainDetailByFieldIdParamsEntity } from "@app/repo-method-param-entities/UpdateComplainDetailByFieldIdParamsEntity";
import ArrayHelper from "@app/helpers/ArrayHelper";

export class ComplaintDetailsRepository extends BaseRepository {

    public create = async (complaintDetails: ComplaintDetails[]) => {
        let resultArr = [];
        for (const complainDetailObj of complaintDetails) {
            let result = await complainDetailObj.save();
            resultArr.push(result);
        }
        return resultArr;
    }

    public update = async (complainDetailObj: any) => {
        let result = await ComplaintDetails.update({
            field_val: complainDetailObj.field_val
        }, {
            where: {
                id: complainDetailObj.complain_detail_id
            }
        });
        return result;
    }

    public updateByComplainIdNFieldId = async (complainDetail: UpdateComplainDetailByFieldIdParamsEntity) => {
        let result = null;
        // if (ArrayHelper.isArrayValid(complainDetails)) {
        // for (const complainDetail of complainDetails) {
        result = await ComplaintDetails.update({
            field_val: complainDetail.fieldVal
        }, {
            where: {
                complaint_id: complainDetail.complainId,
                field_id: complainDetail.fieldId
            }
        });
        // }
        // }
        return result;
    }
}

export const complaintDetailsRepositoryIns = new ComplaintDetailsRepository();