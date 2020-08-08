
import BaseRepository from "@app/services/BaseRepository";
import { Complaint } from "@app/models/Complaint";
import { GetComplaintDetailsParamsEntity } from "@app/repo-method-param-entities/GetComplaintDetailsParamsEntity";
import { ComplaintDetails } from "@app/models/ComplaintDetails";
import { Field } from "@app/models/Field";
import { MakerDetails } from "@app/models/MakerDetails";
import ArrayHelper from "@app/helpers/ArrayHelper";
import { ObjectHelper } from "@app/helpers/ObjectHelper";

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
                            as: "field",
                        }
                    ],
                    required: true
                }
            ]
        })
        return result;
    }

    public getComplaintDetailByFieldName = async (params: GetComplaintDetailsParamsEntity, fieldName: string) => {
        let result = await this.getComplaintDetails(params);
        let complainDetail: ComplaintDetails = null;
        if (ObjectHelper.isObjectNotEmpty(result)) {
            result.complainDetails.forEach((complainDetailObj: ComplaintDetails) => {
                if (complainDetailObj.field.field_name === fieldName) {
                    complainDetail = complainDetailObj;
                }
            })
        }
        return complainDetail;
    }


}


export const complaintRepositoryIns = new ComplaintRepository();