
import BaseRepository from "@app/services/BaseRepository";
import { Complaint } from "@app/models/Complaint";
import { GetComplaintDetailsParamsEntity } from "@app/repo-method-param-entities/GetComplaintDetailsParamsEntity";
import { ComplaintDetails } from "@app/models/ComplaintDetails";
import { Field } from "@app/models/Field";
import { MakerDetails } from "@app/models/MakerDetails";
import { ObjectHelper } from "@app/helpers/ObjectHelper";
import { UserPlan } from "@app/models/UserPlan";
import { UserPaymentDetailsRepository } from "./UserPaymentDetailsRepository";
import { UserPayment } from "@app/models/UserPayment";
import { Plan } from "@app/models/Plan";

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
                    required: true,
                    model: MakerDetails,
                    as: "makerDetail",
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
        // let result = await Complaint.scope(['defaultScope', 'resolvedComplains', 'complainDetails', { method: ['byComplainId', params.complaintId] }]).findOne();
        // , 'resolvedComplains', 'makerDetail', 'complainDetails', { method: ['byComplainId', params.complaintId] }
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

    public getSuccessPageDetails = async (orderId: number, userId: number) => {
        let result = await Complaint.findOne({
            include: [
                {
                    model: UserPlan,
                    required: true,
                    as: "userPlan",
                    where: {
                        status: ['pending', 'success']
                    },
                    include: [
                        {
                            model: UserPayment,
                            required: true,
                            as: "userPayments",
                            where: {
                                id: orderId,
                                payment_status: "completed"
                            }
                        },
                        {
                            model: Plan,
                            required: true,
                            as: "plan"
                        }
                    ]
                },
                {
                    model: ComplaintDetails,
                    required: true,
                    as: "complainDetails",
                    include: [
                        {
                            model: Field,
                            as: "field",
                            // required: true
                        }
                    ]
                }
            ],
            where: {
                user_id: userId
            },
        })
        return result;
    }
}


export const complaintRepositoryIns = new ComplaintRepository();