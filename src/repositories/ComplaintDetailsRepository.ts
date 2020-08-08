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
            field_val: complainDetailObj.compensation_type
        }, {
            where: {
                id: complainDetailObj.complain_detail_id
            }
        });
        return result;
    }

}

export const complaintDetailsRepositoryIns = new ComplaintDetailsRepository();