
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
import { sequelizeConnection } from "@app/SequelizeConnection";
import { QueryTypes } from "sequelize";
import { AsyncLocalStorage } from "async_hooks";
import { Merchant } from "@app/models/Merchant";

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

    public getComplaintDetailsForComplaintReport = async (orderId: number): Promise<Complaint> => {
        let result = await Complaint.scope(['defaultScope', 'complainDetails', { method: ['getPlan', orderId] }]).findOne({
            include: [
                {
                    model: MakerDetails,
                    required: true,
                    as: "makerDetail"
                }
            ]
        });
        return result;
    }

    public getComplaintDetailsForComplaintInvoiceReport = async (orderId: number): Promise<Complaint> => {
        let where = { id: orderId, payment_status: 'completed' };
        let result = await Complaint.scope(['defaultScope', 'getUserPlanComponentDetails', { method: ['getSuccessUserPlan', where] }]).findOne({
            include: [
                {
                    model: User,
                    as: "user",
                    required: true,
                    attributes: [
                        'id',
                        'name'
                    ]
                }
            ]
        });
        return result;
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

    public getDeniedServiceCenterList = async (userPlanId: number) => {
        let query = `select complaints.id as complaint_id,complaints.user_id,pickup_deliveries.service_center_id,pickup_deliveries.user_address_id
        from complaints inner join user_plan on complaints.id = user_plan.complain_id inner join pickup_deliveries on user_plan.id = pickup_deliveries.user_plan_id
        where complaints.status in ('pending') and user_plan.status='success' and pickup_deliveries.status='service_denied' and user_plan.id=:user_plan_id`;
        let result = await sequelizeConnection.connection.query(query, { type: QueryTypes.SELECT, replacements: { user_plan_id: userPlanId } });
        return result;
    }

    public getUserPlanIdByPickupDeliveryId = async (pickupDeliveryId: number) => {
        let userPlanIdQuery = `select user_plan_id from pickup_deliveries where pickup_deliveries.status='service_denied' and pickup_deliveries.id=:pickup_deliverie_id`;

        let userPlanIdResult = await sequelizeConnection.connection.query(userPlanIdQuery, { type: QueryTypes.SELECT, replacements: { pickup_deliverie_id: pickupDeliveryId } });
        return userPlanIdResult[0]['user_plan_id'];
    }

    public getMerchantDetails = async (merchantId: number): Promise<Merchant> => {
        let result = await Merchant.findOne({
            where: {
                id: merchantId
            }
        })
        return result;
    }


}


export const complaintRepositoryIns = new ComplaintRepository();