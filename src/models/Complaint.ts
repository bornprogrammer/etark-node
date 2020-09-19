
import { Model, Optional, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { ComplaintDetails } from "./ComplaintDetails";
import { MakerDetails } from "./MakerDetails";
import { Field } from "./Field";
import { UserPlan } from "./UserPlan";
import { UserPayment } from "./UserPayment";
import { Plan } from "./Plan";
import { User } from "./User";
import { PickupDelivery } from "./PickupDelivery";
import { ServiceCenterActivity } from "./ServiceCenterActivity";
import { ServiceCenterOrder } from "./ServiceCenterOrder";
import { Op } from "sequelize";
import { DeviceDispatchDetails } from "./DeviceDispatchDetails";
import { Where } from "sequelize/types/lib/utils";
import { City } from "./City";
import { UserPlanComponent } from "./UserPlanComponent";
import { PlanComponent } from "./PlanComponents";
import { UserAddress } from "./UserAddress";
import { ServiceCenterPayment } from "./ServiceCenterModel";

export interface ComplaintAttributes {
    id: number,
    user_id?: number,
    maker_detail_id: number,
    status?: string
}

interface ComplaintCreationAttributes extends Optional<ComplaintAttributes, 'id'> { }

// export class Complaint extends Model<ComplaintAttributes, ComplaintCreationAttributes> implements ComplaintAttributes {
export class Complaint extends Model {
    id: number;
    user_id: number;
    maker_detail_id: number;
    status?: string;
    public readonly complainDetails?: ComplaintDetails[];
    public readonly makerDetail?: MakerDetails;
    public readonly userPlan?: UserPlan
    public readonly user?: User
}

Complaint.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    maker_detail_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'resolved', 'unresolved'),
        defaultValue: "pending"
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    }
}, {
    sequelize: sequelizeConnection.connection,
    underscored: true,
    tableName: "complaints",
    defaultScope: {
        where: {
            status: ["pending", "resolved"]
        }
    },
    scopes: {
        resolvedComplains: {
            where: {
                status: "resolved"
            }
        },
        pendingComplains: {
            where: {
                status: "pending"
            }
        },
        complainDetails: {
            include: [
                {
                    model: ComplaintDetails,
                    as: "complainDetails",
                    attributes: [
                        'field_val'
                    ],
                    include: [
                        {
                            model: Field,
                            as: "field",
                            attributes: [
                                'id',
                                'field_name'
                            ]
                        }
                    ],
                    required: true
                }
            ]
        },
        getUserPlanComponentDetails: {
            include: [
                {
                    model: UserPlan,
                    required: true,
                    as: "userPlan",
                    include: [
                        {
                            model: UserPlanComponent,
                            required: true,
                            as: UserPlan.userPlanComponentAs,
                            include: [
                                {
                                    model: PlanComponent,
                                    as: "planComponent"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        getPlan(orderId: number) {
            return {
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
                ],
            }
        },
        getSuccessUserPlan(where: Where) {
            return {
                include: [
                    {
                        model: UserPlan,
                        required: true,
                        as: "userPlan",
                        where: {
                            status: ['success']
                        },
                        include: [
                            {
                                model: UserPayment,
                                required: true,
                                as: "userPayments",
                                where: where
                            },
                            {
                                model: Plan,
                                required: true,
                                as: "plan"
                            }
                        ]
                    },
                ],
            }
        },
        userPlanWithPickupDelivery(pickupDeliveryId: number) {
            return {
                include: [
                    {
                        model: UserPlan,
                        required: true,
                        as: "userPlan",
                        where: {
                            status: ['success']
                        },
                        include: [
                            {
                                model: PickupDelivery,
                                required: true,
                                as: UserPlan.pickupDeliveryDetailAs,
                                where: {
                                    id: pickupDeliveryId,
                                    status: "success"
                                },
                                include: [
                                    {
                                        model: ServiceCenterOrder,
                                        as: PickupDelivery.serviceCenterOrderAs,
                                    },
                                    {
                                        model: DeviceDispatchDetails,
                                        as: PickupDelivery.deviceDispatchDetailsAs
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        getDeliveryDetails(serviceCenterId: number, activityTypes: string[], activityIds: number[]) {
            return {
                include: [
                    {
                        model: UserPlan,
                        required: true,
                        as: "userPlan",
                        include: [
                            {
                                model: PickupDelivery,
                                as: UserPlan.pickupDeliveryDetailAs,
                                required: true,
                                where: {
                                    status: ['success', 'service_denied'],
                                    service_center_id: serviceCenterId
                                },
                                include: [
                                    {
                                        model: ServiceCenterActivity,
                                        as: PickupDelivery.serviceCenterActivityAs,
                                        required: true,
                                        where: {
                                            activity_type: activityTypes,
                                            id: activityIds,
                                        },
                                    },
                                    {
                                        model: UserAddress,
                                        as: PickupDelivery.userAddressAs,
                                        required: true
                                    },
                                    {
                                        model: ServiceCenterOrder,
                                        as: PickupDelivery.serviceCenterOrderAs,
                                        include: [
                                            {
                                                model: ServiceCenterPayment,
                                                as: ServiceCenterOrder.serviceCenterPaymentAs,
                                                required: false,
                                                where: {
                                                    payment_status: "completed"
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        model: DeviceDispatchDetails,
                                        as: PickupDelivery.deviceDispatchDetailsAs,
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        byComplainId(complainId: number) {
            return {
                where: {
                    id: complainId,
                }
            }
        }
    }
})

Complaint.hasMany(ComplaintDetails, { as: "complainDetails" });

ComplaintDetails.belongsTo(Complaint);

Complaint.hasOne(UserPlan, { as: "userPlan", foreignKey: "complain_id" });

UserPlan.belongsTo(Complaint, { as: "complaint", foreignKey: "complain_id" });


