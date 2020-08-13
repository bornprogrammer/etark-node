
import BaseRepository from "@app/repositories/BaseRepository";
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
import { ComplaintDetailByFieldNameParamsEntity } from "@app/repo-method-param-entities/ComplaintDetailByFieldNameParamsEntity";
import { User } from "@app/models/User";
import { Maker } from "@app/models/Maker";
import { GetInspectionFeeComponentParamsEntity } from "@app/repo-method-param-entities/GetInspectionFeeComponentParamsEntity";

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

    public getComplaintDetailByFieldName = async (params: ComplaintDetailByFieldNameParamsEntity) => {
        let result = await this.getComplaintDetails(params);
        let complainDetail: ComplaintDetails = null;
        if (ObjectHelper.isObjectNotEmpty(result)) {
            result.complainDetails.forEach((complainDetailObj: ComplaintDetails) => {
                if (complainDetailObj.field.field_name === params.fieldName) {
                    complainDetail = complainDetailObj;
                }
            })
        }
        return complainDetail;
    }

    public getSuccessPageDetails = async (orderId: number, userId: number) => {
        let result = await Complaint.scope(['defaultScope', 'complainDetails', { method: ['getPlan', orderId] }]).findOne({
            // include: [
            //     {
            //         model: UserPlan,
            //         required: true,
            //         as: "userPlan",
            //         where: {
            //             status: ['pending', 'success']
            //         },
            //         include: [
            //             {
            //                 model: UserPayment,
            //                 required: true,
            //                 as: "userPayments",
            //                 where: {
            //                     id: orderId,
            //                     payment_status: "completed"
            //                 }
            //             },
            //             {
            //                 model: Plan,
            //                 required: true,
            //                 as: "plan"
            //             }
            //         ]
            //     },
            // {
            //     model: ComplaintDetails,
            //     required: true,
            //     as: "complainDetails",
            //     include: [
            //         {
            //             model: Field,
            //             as: "field",
            //             // required: true
            //         }
            //     ]
            // }
            // ],
            where: {
                user_id: userId
            },
        })
        return result;
    }

    public getComplainDetailsForServiceCenterEmail = async (orderId: number) => {
        // let orderId = 146;
        let result = await Complaint.scope(['defaultScope', 'complainDetails', { method: ['getPlan', orderId] }]).findOne({
            include: [
                {
                    model: User,
                    required: true,
                    as: "user",
                    attributes: [
                        'name'
                    ]
                },
                {
                    model: MakerDetails,
                    required: true,
                    as: "makerDetail",
                    attributes: [
                        'display_name'
                    ],
                    include: [
                        {
                            model: Maker,
                            required: true,
                            as: "maker",
                            attributes: [
                                'maker_name'
                            ]
                        }
                    ]
                }
            ]
        });
        return result;
    }

    public getInspectionFeeComponent = async (params: GetInspectionFeeComponentParamsEntity): Promise<Complaint> => {
        let result = await Complaint.findOne({
            include: [
                {
                    model: MakerDetails,
                    required: true,
                    as: "makerDetail",
                    attributes: [
                        'inspection_charges'
                    ],
                }
            ],
            where: {
                id: params.complainId,
            }
        })
        return result;
    }
}


export const complaintRepositoryIns = new ComplaintRepository();