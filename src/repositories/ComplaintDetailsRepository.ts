import BaseRepository from "@app/services/BaseRepository";
import { ComplaintDetails } from "@app/models/ComplaintDetails";

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

    // public updateByFieldId = async (complainDetailObj: UpdateComplainDetailByFieldIdParamsEntity) => {
    //     let result = await ComplaintDetails.update({
    //         field_val: complainDetailObj.fieldVal
    //     }, {
    //         where: {
    //             complaint_id: complainDetailObj.complainId,
    //             field_id: complainDetailObj.field_id
    //         }
    //     });
    //     return result;
    // }
}

export const complaintDetailsRepositoryIns = new ComplaintDetailsRepository();