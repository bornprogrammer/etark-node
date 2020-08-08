
import BaseRepository from "@app/services/BaseRepository";
import { Complaint } from "@app/models/Complaint";
import { GetComplaintDetailsParamsEntity } from "@app/repo-method-param-entities/GetComplaintDetailsParamsEntity";
import { ComplaintDetails } from "@app/models/ComplaintDetails";
import { Field } from "@app/models/Field";
import { MakerDetails } from "@app/models/MakerDetails";

export class ComplaintRepository extends BaseRepository {
    /**
     *
     */
    constructor() {
        super();
    }

    public create(params: any) {

    }

    public getComplaintDetails = async (params: GetComplaintDetailsParamsEntity) => {
        let result = await Complaint.findOne({
            where: {
                id: params.complaintId,
                status: params.complaintStatus
            },
            include: [
                {
                    model: MakerDetails,
                    as: "makerDetail",
                    required: true
                },
                {
                    model: ComplaintDetails,
                    as: "complainDetails",
                    include: [
                        {
                            model: Field,
                            required: true,
                            as: "field"
                        }
                    ],
                    required: true
                }
            ]
        })
        return result;
    }


}


export const complaintRepositoryIns = new ComplaintRepository();