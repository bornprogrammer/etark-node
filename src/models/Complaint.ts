
import { Model, Optional, DataTypes } from "sequelize";
import { sequelizeConnection } from "@app/SequelizeConnection";
import { ComplaintDetails } from "./ComplaintDetails";
import { MakerDetails } from "./MakerDetails";
import { Field } from "./Field";
import { UserPlan } from "./UserPlan";
import { UserPayment } from "./UserPayment";
import { Plan } from "./Plan";
import { User } from "./User";

interface ComplaintAttributes {
    id: number,
    user_id: number,
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
                            // required: true,
                            as: "field",
                            attributes: [
                                'id',
                                'field_name'
                            ]
                        }
                    ],
                    required: true
                },
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
        // complaintUser: {
        //     include: [
        //         {
        //             model: User,
        //             // required: true,
        //             // as: "user"
        //         }
        //     ]
        // },
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


